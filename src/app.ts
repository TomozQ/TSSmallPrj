//Validation
interface Validatable{
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

function validate(validatableInput: Validatable){
    let isValid = true
    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }
    if(
        validatableInput.minLength != null && 
        typeof validatableInput.value === 'string'
    ){
        isValid = 
            isValid && validatableInput.value.length >= validatableInput.minLength
    }
    if(
        validatableInput.maxLength != null && 
        typeof validatableInput.value === 'string'
    ){
        isValid = 
            isValid && validatableInput.value.length <= validatableInput.maxLength
    }
    if(
        validatableInput.min != null && 
        typeof validatableInput.value === 'number'
    ){
        isValid = 
            isValid && validatableInput.value >= validatableInput.min
    }
    if(
        validatableInput.max != null && 
        typeof validatableInput.value === 'number'
    ){
        isValid = 
            isValid && validatableInput.value <= validatableInput.max
    }
    return isValid
}

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


        const titelValidatable: Validatable = {
            value: enterdTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enterddescription,
            required: true,
            minLength: 5
        }
        const mandayValidatable: Validatable = {
            value: +enterdmanday,
            required: true,
            min: 1,
            max: 1000
        }
        if(
            !validate(titelValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(mandayValidatable)
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