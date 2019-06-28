import { Injectable, NgZone } from '@angular/core';
import { take } from 'rxjs/operators';


export type MoveHandler = (event: MouseEvent, dx: number, dy: number, x: number, y: number) => void;
export type UpHandler = (event: MouseEvent, x: number, y: number, moved: boolean) => void;

@Injectable()
export class DragAndDropService {

    constructor(private zone: NgZone) {}

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

            if (event.preventDefault){
                mouseMoveEvent.preventDefault();
            }
            else {
                mouseMoveEvent.returnValue = false;
            }
            mouseMoveEvent.stopPropagation();
        };

        const mouseUpHandler = (mouseUpEvent: MouseEvent): void => {

            mouseUpEvent.stopPropagation();
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
