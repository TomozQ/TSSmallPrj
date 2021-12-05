import { DragTarget } from "../models/drag-drop"
import { Project } from "../models/project"
import Component from "./base-components"
import { autobind } from "../decorators/autobind"
import { projectState } from "../state/project-state"
import { ProjectStatus } from "../models/project"
import { ProjectItem } from "./project-item"

// ProjectList Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> 
implements DragTarget{
assignedProjects: Project[]

constructor(private type: 'active' | 'finished'){   //constructorの引数にこれだけ入れるだけでプロパティを追加したことになる
    super('project-list', 'app', false, `${type}-projects`) //ベースクラスのconstructorを呼びだす -> templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: stringを渡す
    this.assignedProjects = []

    this.configure()
    this.renderContent()
}

@autobind
dragOverHandler(event: DragEvent){
    if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
        // drag & dropだけが許可されるという動作になる　dragoverhandlerでpreventDefaultが呼び出された要素にだけdropHandlerが呼びだされる
        event.preventDefault()
        const listEl = this.element.querySelector('ul')!
        listEl.classList.add('droppable')
    }
}

@autobind
dropHandler(event: DragEvent){
    const prjId = event.dataTransfer!.getData('text/plain')
    projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
}

@autobind
dragLeaveHandler(_: DragEvent){
    const listEl = this.element.querySelector('ul')!
    listEl.classList.remove('droppable')
}

// publicメソッドは一般的にprivateメソッドより上に定義する
configure(){
    this.element.addEventListener('dragover', this.dragOverHandler)
    this.element.addEventListener('drop', this.dropHandler)
    this.element.addEventListener('dragleave', this.dragLeaveHandler)

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
        new ProjectItem(listEl.id, prjItem)
    }
}
}
