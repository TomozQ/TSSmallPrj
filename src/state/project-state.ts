import { Project, ProjectStatus } from '../models/project.js'

// Project State Management
type Listener<T> = (items: T[]) => void

class State<T> {
    protected listeners: Listener<T>[] = [] //protectedは継承先のクラスからでもアクセスできる classの外部からはアクセスできない

    addListener(listenerFn: Listener<T>){
        this.listeners.push(listenerFn)
    }

}

export class ProjectState extends State<Project>{
    private projects: Project[] = []  
    private static instance: ProjectState

    private constructor() { //シングルトンなクラス
        super()
    }

    static getInstance(){
        if (this.instance) {
            return this.instance
        }
        this.instance = new ProjectState()
        return this.instance
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
        this.updateListners()
    }

    moveProject(projectId: string, newStatus: ProjectStatus){
        const project = this.projects.find(prj => prj.id === projectId)
        if(project && project.status !== newStatus){
            project.status = newStatus
            this.updateListners()
        }
    }

    private updateListners(){
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice())
        }
    }
}

export const projectState = ProjectState.getInstance() //グローバルなプロジェクトステート

//projectStateは複数ファイルでimportされているが、最初にimportされた時の1回だけ実行される。