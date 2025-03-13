const userNames = {
    "pc1": "Carmen:",
    "pc2": "Daniel:",
    "pc3": "Sabrina:"
};

// Define manualmente o nome do funcionário para cada computador
const currentUser = userNames["pc2"];

// Função para modificar o campo de texto antes do envio
let main = document.querySelector("#main")
let chatBox = main.querySelector("div[contenteditable='true'][role='textbox']")
let message
function verify_chatbox(){
    main = document.querySelector("#main")
    chatBox = main.querySelector("div[contenteditable='true'][role='textbox']")
}
async function modifyMessage(username) {
    main = document.querySelector("#main")
    chatBox = main.querySelector("div[contenteditable='true'][role='textbox']")

    message = chatBox.innerText;
    console.log(message)

    if (message.length > 0) {
        chatBox.focus();

        document.execCommand('selectAll')
        await new Promise(resolve=> setTimeout(resolve, 10))

        document.execCommand('cut');
        await new Promise(resolve=> setTimeout(resolve, 10))
        
        // Criar um objeto ClipboardEvent e simular um evento de colagem (paste)
        let pasteData = new DataTransfer();
        pasteData.setData("text/plain", `*${username}* \n\n${message}`); // Texto formatado com quebras de linha
        
        let pasteEvent = new ClipboardEvent("paste", {
            bubbles: true,
            cancelable: true,
            clipboardData: pasteData
        });

        chatBox.dispatchEvent(pasteEvent);
        await new Promise(resolve => setTimeout(resolve, 10));

        chatBox.dispatchEvent(new Event('change', {bubbles: true}))
        await new Promise(resolve=> setTimeout(resolve, 10))

        let sendButton = main.querySelector('[data-testid="send"]') || main.querySelector('[data-icon="send"]') // Simula Enter para enviar
        if (sendButton){
            await new Promise(resolve=> setTimeout(resolve, 50))
            sendButton.click()
        }
    }
}
function botaoFuncional() { 
    
    chatBox.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            console.log("botao funcionando")
            modifyMessage(currentUser)
            }
        }
    );
}

const listener = getEventListeners(chatBox)["keydown"][0]
chatBox.removeEventListener('keydown', listener.listener, listener.useCapture)
botaoFuncional()
setInterval(()=>{
    verify_chatbox()
    botaoFuncional()
    let listeners_list = getEventListeners(chatBox)["keydown"]
    if(listeners_list.size() > 1){
        let listener_novo = getEventListeners(chatBox)["keydown"][0]
        chatBox.removeEventListener('keydown', listener_novo.listener, listener_novo.useCapture)
    }}, 100)