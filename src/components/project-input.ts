import Cmp from "./base-components"
import * as Validation from "../util/validation"
import { autobind as Autobind } from "../decorators/autobind"
import { projectState } from "../state/project-state"

//projectInputClass
export class ProjectInput extends Cmp<HTMLDivElement, HTMLFormElement>{
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    mandayInputElement: HTMLInputElement

    constructor(){
        super('project-input', 'app', true, 'user-input')

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement
        this.mandayInputElement = this.element.querySelector('#manday') as HTMLInputElement

        this.configure()
    }

    configure (){
        this.element.addEventListener('submit', this.submitHandler)
        // this.element.addEventListener('submit', this.submitHandler.bind(this)) 
        //configureメソッドはconstructorから呼ばれる -> ここでのthisはクラスで作成されたインスタンス
        //submitHandlerにこのthisをbindして渡す
    }               
    
    renderContent(){}

    private gatherUserInput(): [string, string, number] | void{    //タプル型の返却値
        const enterdTitle = this.titleInputElement.value
        const enterddescription = this.descriptionInputElement.value
        const enterdmanday = this.mandayInputElement.value


        const titelValidatable: Validation.Validatable = {
            value: enterdTitle,
            required: true
        }
        const descriptionValidatable: Validation.Validatable = {
            value: enterddescription,
            required: true,
            minLength: 5
        }
        const mandayValidatable:Validation. Validatable = {
            value: +enterdmanday,
            required: true,
            min: 1,
            max: 1000
        }
        if(
            !Validation.validate(titelValidatable) ||
            !Validation.validate(descriptionValidatable) ||
            !Validation.validate(mandayValidatable)
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

    @Autobind
    private submitHandler(event: Event){
        event.preventDefault()
        console.log(this.titleInputElement.value)
        const userInput = this.gatherUserInput()
        if(Array.isArray(userInput)){
            const [title, desc, manday] = userInput
            projectState.addProject(title, desc, manday)
            this.clearInputs()
        }
    }                                                           
}
