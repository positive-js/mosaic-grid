import { Injectable } from '@angular/core';


export type MoveHandler = (event: MouseEvent, dx: number, dy: number, x: number, y: number) => void;
export type UpHandler = (event: MouseEvent, x: number, y: number, moved: boolean) => void;

@Injectable()
export class DragAndDropService {

    drag(event: MouseEvent, {move, up}: { move: MoveHandler; up?: UpHandler }): void {
        const startX = event.pageX;
        const startY = event.pageY;
        let x = startX;
        let y = startY;
        let moved = false;

        const mouseMoveHandler = (mouseMoveEvent: MouseEvent): void => {
            const dx = mouseMoveEvent.pageX - x;
            const dy = mouseMoveEvent.pageY - y;
            x = mouseMoveEvent.pageX;
            y = mouseMoveEvent.pageY;
            if (dx || dy) {
                moved = true;
            }

            move(mouseMoveEvent, dx, dy, x, y);

            mouseMoveEvent.preventDefault();
        };

        const mouseUpHandler = (mouseUpEvent: MouseEvent): void => {
            x = mouseUpEvent.pageX;
            y = mouseUpEvent.pageY;

            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);

            if (up) {
                up(mouseUpEvent, x, y, moved);
            }
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }
}
