// Drag & Drop
export interface Draggable{
    dragStartHandler(event: DragEvent): void
    dragEndHandler(evnet: DragEvent): void
}

export interface DragTarget{
    dragOverHandler(event: DragEvent): void   //その場所が有効なドロップ対象かを伝える
    dropHandler(event: DragEvent): void       //実際にドロップが行われたときの処理
    dragLeaveHandler(event: DragEvent): void  //ビジュアル上のフィードバックを作成する。
}
