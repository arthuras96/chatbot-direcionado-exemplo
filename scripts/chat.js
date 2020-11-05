var app = angular.module('app', []);

app.controller('ChatController', ['$scope', '$http', function($scope, $http) {
    let time = "";
    
    let nextIntent = "";
    let lastMsger = "";
    
    $scope.messages = [];

    $scope.onloadEve = async function() {
        const msgerNode = await searchByIntent("welcome");
        addBotMsger(msgerNode);
    }

    async function searchByIntent(intent){
        return $http.get('data/chatlogic.json').then(function(response) {
            return response.data.responses.filter(function(obj) { return obj.intent === intent; })[0];
         });
    }

    async function addBotMsger(msger) {
        let proceed = await haveAction(msger.intent);
        if(proceed === true){
            
            if(msger.enable_chat === false) { disableChat(); }
            else { enableChat(); }
            
            nextIntent = msger.intent_direction;

            let temporaryNode = "";
            for(let outputIndex in msger.output) {
                if(msger.output[outputIndex].response_type === "text") {

                    if(temporaryNode !== "") { $scope.messages.push(temporaryNode); temporaryNode = ""; }

                    temporaryNode = {
                        sender: "Bot",
                        text: msger.output[outputIndex].text,       
                        hour: time,
                        buttons: [],
                        class: "msg left-msg",
                        image: "assets/images/bot.svg"
                    };
                } 
                else if(msger.output[outputIndex].response_type === "button") {
                    
                    if(temporaryNode === "") { 
                        temporaryNode = {
                            sender: "Bot",
                            text: "",       
                            hour: time,
                            buttons: [],
                            class: "msg left-msg",
                            image: "assets/images/bot.svg"
                        }
                    }

                    temporaryNode.buttons.push({button: msger.output[outputIndex].button});
                }
            }
            if(temporaryNode !== "") { $scope.messages.push(temporaryNode); temporaryNode = ""; }
            $scope.$apply();
            window.location.href='#anchor';
        }
    }

    function enableChat() {
        document.querySelector('#msger-input').disabled = false;
        document.querySelector('#msger-send').disabled = false;
    }

    function disableChat() {
        document.querySelector('#msger-input').disabled = true;
        document.querySelector('#msger-send').disabled = true;
    }

    async function haveAction(intent) {
        if(intent === "secretary_ticket_edit") {
            $scope.message.text = lastMsger;
            return true;
        }
        if(intent === "academic_ticket_edit") {
            $scope.message.text = lastMsger;
            return true;
        }
        if(intent === "secretary_ticket_end") {
            return openSecretaryTicket();
        }
        if(intent === "academic_ticket_end") {
            return openAcademicTicket();
        }
        if(intent === "restart") {
            $scope.messages = [];
            addBotMsger(await searchByIntent("welcome"));
            return false;
        }

        return true;
    }

    async function openSecretaryTicket() {
        console.log("Aqui será necessário abrir um ticket para a secretaria, com a seguinte descrição: " + lastMsger);
        return await true;
    }

    async function openAcademicTicket() {
        console.log("Aqui será necessário abrir um ticket acadêmico, com a seguinte descrição: " + lastMsger);
        return await true;
    }

    $scope.sendMessage = async function () {
        if($scope.message.text !== "") {
            $scope.messages.push({
                sender: "Humano",
                text: $scope.message.text,       
                hour: time,
                buttons: {},
                class: "msg right-msg",
                image: "assets/images/human.svg"
            });

            lastMsger = $scope.message.text;
            $scope.message.text = "";

            if(nextIntent !== "") {
                addBotMsger(await searchByIntent(nextIntent));
            }

            window.location.href='#anchor';
        }
    };

    $scope.clickOption = async function (buttonData) {
        
        if(buttonData.output_text !== "") {
            $scope.messages.push({
                sender: "Humano",
                text: buttonData.output_text,   
                hour: time,
                buttons: {},
                class: "msg right-msg",
                image: "assets/images/human.svg"
            });
        }

        if(buttonData.intent_direction !== "") {
            addBotMsger(await searchByIntent(buttonData.intent_direction));
        }

        window.location.href='#anchor';
    };
}]);