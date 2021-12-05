import { Draggable } from '../models/drag-drop' //拡張子はjs
import Component from './base-components'
import { Project } from '../models/project'
import { autobind } from '../decorators/autobind'

    //projectItem class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> 
// namespace内のインターフェースの利用
// implements DDInterfaces.Draggable{
implements Draggable{
private project: Project

get manday() {
    if(this.project.manday < 20){
        return this.project.manday.toString() + '人日'
    }else{
        return (this.project.manday / 20).toString() + '人月'
    }
}
constructor(hostId: string, project: Project){
    super('single-project', hostId, false, project.id)
    this.project = project

    this.configure()
    this.renderContent()
}

@autobind
dragStartHandler(event: DragEvent){
    event.dataTransfer!.setData('text/plain', this.project.id)  //dataTransfer -> drageventオブジェクトだけに存在するdataを転送するためのプロパティ
    event.dataTransfer!.effectAllowed = 'move'                  //ブラウザ上でカーソルがどのように表示されるかを指定
}

dragEndHandler(_: DragEvent){
    console.log('drag終了')
}

configure(){
    this.element.addEventListener('dragstart', this.dragStartHandler)
    this.element.addEventListener('dragend', this.dragEndHandler)
}

renderContent(){
    this.element.querySelector('h2')!.textContent = this.project.title
    this.element.querySelector('h3')!.textContent = this.manday  //getter関数はプロパティのようにアクセスする
    this.element.querySelector('p')!.textContent = this.project.description
}
}
