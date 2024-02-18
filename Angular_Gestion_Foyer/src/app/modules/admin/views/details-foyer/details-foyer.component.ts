import { Component, Input, OnInit } from '@angular/core';
import { Bloc } from 'src/app/core/models/bloc/bloc';
import { Foyer } from 'src/app/core/models/foyer/foyer';
import { BlocService } from 'src/app/core/services/bloc/bloc.service';
import { ChambreService } from 'src/app/core/services/chambre/chambre.service';
import { FoyerService } from 'src/app/core/services/foyer/foyer.service';

@Component({
  selector: 'app-details-foyer',
  templateUrl: './details-foyer.component.html',
  styleUrls: ['./details-foyer.component.css']
})
export class DetailsFoyerComponent implements OnInit {

  @Input() inputData: number | undefined;
  foyer!:Foyer;
  listBlocs!:Bloc[];
  nombreChambres: Map<number, number> = new Map<number, number>();

  constructor(private foyerService: FoyerService, private blocService: BlocService, private chambreService: ChambreService) { }

  ngOnInit(): void {
    this.getFoyerById(this.inputData);
  }


  getFoyerById(inputData: number | undefined) {
    if (inputData !== undefined) {
      this.foyerService.getFoyerById(inputData).subscribe((res: any) => {
        this.foyer = res;
        this.getAllBlocsByIdFoyer(this.foyer.idFoyer);
      });
    } else {
      console.error('Input data is undefined');
    }
  }

  getAllBlocsByIdFoyer(idFoyer: number) {
    this.blocService.getAllBlocsByIdFoyer(idFoyer).subscribe((data) => {
      this.listBlocs = data;
      this.listBlocs.forEach(bloc => {
        this.chambreService.getNombreChambresParBloc(bloc.idBloc).subscribe((data) => {
          this.nombreChambres.set(bloc.idBloc, data);
        });
      });
    });
  }
  
}
