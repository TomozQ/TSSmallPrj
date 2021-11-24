//Project type
enum ProjectStatus {
    Active, Finished
}
class Project{
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public manday: number, 
        public status: ProjectStatus
    ){

    }
}

// Project State Management
type Listener = (items: Project[]) => void

class ProjectState{
    private listeners: Listener[] = []
    private projects: Project[] = []
    private static instance: ProjectState

    private constructor() { //シングルトンなクラス

    }

    static getInstance(){
        if (this.instance) {
            return this.instance
        }
        this.instance = new ProjectState()
        return this.instance
    }

    addListener(listenerFn: Listener){
        this.listeners.push(listenerFn)
    }

    addProject(title: string, description: string, manday: number){
        // const newProject = {
        //     id: Math.random().toString(),
        //     title: title,
        //     description: description,
        //     manday: manday,
        // }
        const newProject = new Project(
            Math.random().toString(),   //id
            title,                      //title
            description,                //description
            manday,                     //manday
            ProjectStatus.Active,       //project status 追加時デフォルトはacive
        )
        this.projects.push(newProject)
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice())
        }
    }
}

const projectState = ProjectState.getInstance() //グローバルなプロジェクトステート

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

//Component Class
// 直接インスタンス化されるのではなく常に継承されて使用されるべきクラスなので抽象化 インスタンス化できない
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement
    hostElement: T
    element: U

    constructor(
        templateId: string, 
        hostElementId: string, 
        insertAtStart: boolean,
        newElementId?: string,
    ){
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement
        this.hostElement = document.getElementById(hostElementId)! as T //T -> hostElement(append先要素)

        const importedNode = document.importNode(this.templateElement.content, true)    //第2引数のtrue はdeepcloneするかどうか。 deepClone -> 子ノードまで取得する
        this.element = importedNode.firstElementChild as U
        // newElementIdは任意のパラメータなので条件分岐が必要
        if(newElementId){           
            this.element.id = newElementId
        }
        this.attach(insertAtStart)
    }

    private attach(insertAtBegining: boolean){
        this.hostElement.insertAdjacentElement(insertAtBegining ? 'afterbegin' : 'beforeend', this.element)
    }

    //抽象メソッド: このクラスを継承して使用するクラスで下記2つのメソッドを使用することを強制する。
    abstract configure(): void
    abstract renderContent(): void
}

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement>{
    assignedProjects: Project[]

    constructor(private type: 'active' | 'finished'){   //constructorの引数にこれだけ入れるだけでプロパティを追加したことになる
        super('project-list', 'app', false, `${type}-projects`) //ベースクラスのconstructorを呼びだす -> templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: stringを渡す
        this.assignedProjects = []

        this.configure()
        this.renderContent()
    }

    // publicメソッドは一般的にprivateメソッドより上に定義する
    configure(){
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if (this.type === 'active'){
                    return prj.status === ProjectStatus.Active
                }
                return prj.status === ProjectStatus.Finished
            })
            this.assignedProjects = relevantProjects
            this.renderProjects()
        })
    }

     renderContent(){
        const listId = `${this.type}-project-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.type === 'active' ? '実行中プロジェクト' : '完了プロジェクト'
    }

    private renderProjects(){
        const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement
        listEl.innerHTML = ''
        for (const prjItem of this.assignedProjects) {
            const listItem= document.createElement('li')
            listItem.textContent = prjItem.title
            listEl.appendChild(listItem)
        }
    }
}

//projectInputClass
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
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
            projectState.addProject(title, desc, manday)
            this.clearInputs()
        }
    }                                                           
}

const prjInput = new ProjectInput()
const activeProjectList = new ProjectList('active')
const finishedProjectList = new ProjectList('finished')