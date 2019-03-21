import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'mcPx'
})
export class PixelConverterPipe implements PipeTransform {
    /**
     * Pipe transform implementation.
     * @param value Source value.
     * @returns Converted pixel value.
     */
    transform(value: string | number): string {
        if (value === undefined) {
            return;
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'number') {
            return `${value}px`;
        }
    }
}
