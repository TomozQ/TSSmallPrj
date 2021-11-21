//autoBindDecorator
function autobind(
    _: any, 
    __: string, 
    descriptor: PropertyDescriptor
){
    const originalMethod = descriptor.value
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}

//projectInputClass
class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    mandayInputElement: HTMLInputElement

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        const importedNode = document.importNode(this.templateElement.content, true)    //第2引数のtrue はdeepcloneするかどうか。 deepClone -> 子ノードまで取得する
        
        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = 'user-input'

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement
        this.mandayInputElement = this.element.querySelector('#manday') as HTMLInputElement

        this.configure()
        this.attach()
    }

    private gatherUserInput(): [string, string, number] | void{    //タプル型の返却値
        const enterdTitle = this.titleInputElement.value
        const enterddescription = this.descriptionInputElement.value
        const enterdmanday = this.mandayInputElement.value

        if(
            enterdTitle.trim().length === 0 || 
            enterddescription.trim().length === 0 || 
            enterdmanday.trim().length === 0
        ) {
            alert('入力値が正しくありません。再度お試しください。')
            return
        }else{
            return [ enterdTitle, enterddescription, +enterdmanday ]
        }
    }

    private clearInputs(){
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.mandayInputElement.value = ''
    }

    @autobind
    private submitHandler(event: Event){
        event.preventDefault()
        console.log(this.titleInputElement.value)
        const userInput = this.gatherUserInput()
        if(Array.isArray(userInput)){
            const [title, desc, manday] = userInput
            console.log(title, desc, manday)
            this.clearInputs()
        }
    }

    private configure (){
        this.element.addEventListener('submit', this.submitHandler)
        // this.element.addEventListener('submit', this.submitHandler.bind(this)) 
        //configureメソッドはconstructorから呼ばれる -> ここでのthisはクラスで作成されたインスタンス
        //submitHandlerにこのthisをbindして渡す
    }                                                                           

    private attach(){
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const prjInput = new ProjectInput()