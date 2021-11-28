    //Component Class
export const something = '...'
// 直接インスタンス化されるのではなく常に継承されて使用されるべきクラスなので抽象化 インスタンス化できない
export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
