class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    mandayElement: HTMLInputElement

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        const importedNode = document.importNode(this.templateElement.content, true)    //第2引数のtrue はdeepcloneするかどうか。 deepClone -> 子ノードまで取得する
        
        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = 'user-input'

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement
        this.mandayElement = this.element.querySelector('#manday') as HTMLInputElement

        this.configure()
        this.attach()
    }

    private submitHandler(event: Event){
        event.preventDefault()
        console.log(this.titleInputElement.value)
    }

    private configure (){
        this.element.addEventListener('submit', this.submitHandler.bind(this))  //configureメソッドはconstructorから呼ばれる -> ここでのthisはクラスで作成されたインスタンス
    }                                                                           //submitHandlerにこのthisをbindして渡す

    private attach(){
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const prjInput = new ProjectInput()