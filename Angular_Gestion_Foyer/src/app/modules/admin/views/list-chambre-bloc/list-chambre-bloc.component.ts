import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeChambre } from 'src/app/core/models/TypeChambre/type-chambre.enum';
import { Bloc } from 'src/app/core/models/bloc/bloc';
import { Chambre } from 'src/app/core/models/chambre/chambre';
import { Foyer } from 'src/app/core/models/foyer/foyer';
import { BlocService } from 'src/app/core/services/bloc/bloc.service';
import { ChambreService } from 'src/app/core/services/chambre/chambre.service';
import { FoyerService } from 'src/app/core/services/foyer/foyer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-chambre-bloc',
  templateUrl: './list-chambre-bloc.component.html',
  styleUrls: ['./list-chambre-bloc.component.css']
})
export class ListChambreBlocComponent {

  BlocForm!: FormGroup;
  listBlocs: Bloc[] = [];
  ChambreForm!: FormGroup;
  listChambres: Chambre[] = [];
  typesChambre: string[] = Object.values(TypeChambre);
  typeChambreSelectionne!: TypeChambre;

  listFoyer: Foyer[] = [];
  selectedFoyerId: number | null = null;
  selectedBlocId: number | null = null;
  selectedChambresIds: number[] = [];
  listChambresB: Chambre[] = [];

  selectedBloc: Bloc | null = null;
  selectedChambre: Chambre | null = null;

  constructor(private formBuilder: FormBuilder, private blocService: BlocService, private chambreService: ChambreService, private foyerService: FoyerService) { }

  ngOnInit() {
    this.BlocForm = this.formBuilder.group({
      nomBloc: ['', Validators.required],
      capaciteBloc: ['', Validators.required]
    });
    this.ChambreForm = this.formBuilder.group({
      numeroChambre: ['', Validators.required],
      typeC: ['', Validators.required]
    });

    this.getAllBloc();
    this.getAllChambre();
    this.getAllFoyer();
    this.getChambresSansBloc();
  }

  onTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.typeChambreSelectionne = selectElement.value as TypeChambre;
  }

  ajouerBloc() {
    if (this.BlocForm.valid) {
      this.blocService.addBloc(this.BlocForm.value).subscribe(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Le foyer a été ajoutée avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        this.getAllBloc();
        this.BlocForm.reset();
      });
    }
  }

  getAllBloc() {
    this.blocService.getAllBlocs().subscribe((res: Bloc[]) => {
      this.listBlocs = res;
      this.listBlocs.forEach(bloc => {
        this.foyerService.getFoyerByIdBloc(bloc.idBloc).subscribe(
          (foyer) => {
            bloc.foyer = foyer;
          }
        );
      });
    });
  }

  deleteBloc(id:number){
    this.blocService.desaffecterBlocFoyer(id).subscribe(() => {
      this.blocService.deleteBloc(id).subscribe(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Le bloc a été supprimée avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        this.getAllBloc();
      });
    });
  }

  openEditModalBloc(bloc: Bloc) {
    this.selectedBloc = bloc;
    this.BlocForm.setValue({
      nomBloc: bloc.nomBloc,
      capaciteBloc: bloc.capaciteBloc
    });
  }

  updateBloc() {
    if (this.BlocForm.valid && this.selectedBloc) {
      const updateBloc: Bloc = {
        ...this.selectedBloc,
        ...this.BlocForm.value
      };
      this.blocService.updateBloc(updateBloc).subscribe(() => {
        this.getAllBloc();
        this.BlocForm.reset();
      });
    }
  }

  getAllFoyer() {
    this.foyerService.getAllFoyers().subscribe((res: Foyer[]) => {
      this.listFoyer = res;
    });
  }

  openAffectModalBloc(id:number) {
    this.selectedBlocId = id;
    this.selectedFoyerId = null;
  }

  affecterBlocAFoyer() {
    if (this.selectedFoyerId !== null && this.selectedBlocId !== null) {
      this.blocService.affecterBlocAFoyer(this.selectedBlocId, this.selectedFoyerId).subscribe((res: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'success',
          title: 'Le bloc a été affecté avec succès'
        })
        this.getAllBloc();
      });
    } else {
      console.error('Foyer ID or bloc is not selected');
    }
  }

  openAffectModalBlocC(id: number) {
    this.selectedBlocId = id;
    this.selectedChambresIds = [];
}


  getChambresSansBloc() {
    this.chambreService.getChambresSansBloc().subscribe((res: Chambre[]) => {
      this.listChambresB = res;
      console.log("chambres sans bloc", this.listChambresB);
    });
  }

affecterChambresABloc() {
  if (this.selectedChambresIds.length > 0 && this.selectedBlocId !== null) {
      this.blocService.affecterChambresABloc(this.selectedChambresIds, this.selectedBlocId)
          .subscribe({
              next: (res) => {
                  Swal.fire({
                      toast: true,
                      position: 'top-end',
                      icon: 'success',
                      title: 'Les chambres ont été affectées avec succès',
                      showConfirmButton: false,
                      timer: 1500
                  });
                  this.getAllChambre();
                  this.getChambresSansBloc();
              },
              error: (err) => {
                  console.error('Erreur lors de l\’affectation des chambres', err);
              }
          });
  } else {
      console.error('Aucune chambre sélectionnée ou bloc non sélectionné');
  }
}





  ajouerChambre() {
    if (this.ChambreForm.valid) {
      this.chambreService.addChambre(this.ChambreForm.value).subscribe(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Le foyer a été ajoutée avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        this.getAllChambre();
        this.ChambreForm.reset();
      });
    }
  }

  getAllChambre() {
    this.chambreService.getAllChambres().subscribe((res: Chambre[]) => {
        this.listChambres = res;
        this.listChambres.forEach(chambre => {
            if (chambre.bloc && chambre.bloc.idBloc) {
                this.blocService.getBlocById(chambre.bloc.idBloc).subscribe(
                    (bloc) => {
                        chambre.bloc = bloc;
                        if (bloc && bloc.idBloc) {
                            this.foyerService.getFoyerByIdBloc(bloc.idBloc).subscribe(
                                (foyer) => {
                                    chambre.bloc.foyer = foyer;
                                }
                            );
                        }
                    }
                );
            } else {
                console.log("Aucun bloc associé ou idBloc est null pour la chambre", chambre);
            }
        });
    });
  }


  deleteChambre(id:number){
    this.chambreService.desaffecterChambreDeBloc(id).subscribe(() => {
      this.chambreService.deleteChambre(id).subscribe(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Le chambre a été supprimée avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        this.getAllChambre();
      });
    });
  }

  openEditModalChambre(chambre: Chambre) {
    this.selectedChambre = chambre;
    this.ChambreForm.setValue({
      numeroChambre: chambre.numeroChambre,
      typeC: chambre.typeC
    });
  }

  updateChambre() {
    if (this.ChambreForm.valid && this.selectedChambre) {
      const updateChambre: Chambre = {
        ...this.selectedChambre,
        ...this.ChambreForm.value
      };
      this.chambreService.updateChambre(updateChambre).subscribe(() => {
        this.getAllChambre();
        this.ChambreForm.reset();
      });
    }
  }
}
