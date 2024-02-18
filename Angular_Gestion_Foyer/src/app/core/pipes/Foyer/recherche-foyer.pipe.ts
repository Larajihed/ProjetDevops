import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rechercheFoyer'
})
export class RechercheFoyerPipe implements PipeTransform {

  transform(value: any[], term: string): any[] {
    if (!term) {
      return value;
    } else {
      return value.filter(item => item.nomFoyer.toLowerCase().includes(term.toLowerCase()));
    }
  }

}
