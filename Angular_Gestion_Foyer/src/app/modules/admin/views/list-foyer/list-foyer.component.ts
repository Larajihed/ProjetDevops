import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Foyer } from 'src/app/core/models/foyer/foyer';
import { Universite } from 'src/app/core/models/universite/universite';
import { FoyerService } from 'src/app/core/services/foyer/foyer.service';
import { UniversiteService } from 'src/app/core/services/universite/universite.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-foyer',
  templateUrl: './list-foyer.component.html',
  styleUrls: ['./list-foyer.component.css']
})
export class ListFoyerComponent implements OnInit {

  listFoyer: Foyer[] = [];
  selectedFoyer: Foyer | null = null;
  rechercheFoyer: string = '';
  FoyerForm!: FormGroup;
  FoyerBUForm!: FormGroup;
  id_foyer!:number;
  showMe:boolean=false;

  listUniversitesWithoutFoyer: Universite[] = [];
  selectedUniversiteId: number | null = null;
  panneauActif: string = 'heading-1';

  constructor(private formBuilder: FormBuilder, private foyerService:FoyerService, private universiteService: UniversiteService) { }

  infoFoyer(id:number) {
    this.id_foyer=id;
    this.showMe=!this.showMe;
  }

  ngOnInit() {
    this.getAllFoyer();
    this.getUniversitesWithoutFoyer();
    this.FoyerForm = this.formBuilder.group({
      nomFoyer: ['', Validators.required],
      capaciteFoyer: ['', Validators.required]
    });
    this.FoyerBUForm = this.formBuilder.group({
      universiteId: [null, Validators.required],
      nomFoyer: ['', Validators.required],
      capaciteFoyer: ['', Validators.required],
      blocs: this.formBuilder.array([])
    });
    this.ajouterBloc();
  }

  getAllFoyer() {
    this.foyerService.getAllFoyers().subscribe((res: Foyer[]) => {
      this.listFoyer = res;
    });
  }

  ajouerFoyer() {
    if (this.FoyerForm.valid) {
      this.foyerService.addFoyer(this.FoyerForm.value).subscribe(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Le foyer a été ajoutée avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        this.getAllFoyer();
        this.FoyerForm.reset();
      });
    }
  }

  get blocs(): FormArray {
    return this.FoyerBUForm.get('blocs') as FormArray;
  }

  ajouterBloc() {
    const blocGroup = this.formBuilder.group({
      nomBloc: ['', Validators.required],
      capaciteBloc: ['', Validators.required]
    });
    this.blocs.push(blocGroup);
  }

  supprimerBloc(index: number) {
    this.blocs.removeAt(index);
  }

  getUniversitesWithoutFoyer() {
    this.universiteService.getUniversitesWithoutFoyer().subscribe((res: Universite[]) => {
      this.listUniversitesWithoutFoyer = res;
    });
  }

  ajouerFoyerBU() {
    if (this.FoyerBUForm.valid) {
      const universiteFormControl = this.FoyerBUForm.get('universiteId');
  
      if (universiteFormControl && universiteFormControl.value) {
        const universiteId = universiteFormControl.value;
  
        this.foyerService.ajouterFoyerEtAffecterAUniversite(this.FoyerBUForm.value, universiteId).subscribe(
          () => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Le foyer a été ajoutée avec succès',
              showConfirmButton: false,
              timer: 1500
            });
            this.getAllFoyer();
            this.FoyerBUForm.reset();
          },
          error => {
            console.error("Erreur lors de l'ajout du foyer:", error);
          }
        );
      } else {
        console.log("Aucune université sélectionnée ou le formulaire 'universiteId' est introuvable");
      }
    } else {
      console.log("Formulaire FoyerBUForm non valide");
    }
  }


  openEditModal(foyer: Foyer) {
    this.selectedFoyer = foyer;
    this.FoyerForm.setValue({
      nomFoyer: foyer.nomFoyer,
      capaciteFoyer: foyer.capaciteFoyer
    });
  }

  updateFoyer() {
    if (this.FoyerForm.valid && this.selectedFoyer) {
      const updatedFoyer: Foyer = {
        ...this.selectedFoyer,
        ...this.FoyerForm.value
      };
      this.foyerService.updateFoyer(updatedFoyer).subscribe(() => {
        this.getAllFoyer();
        this.FoyerForm.reset();
      });
    }
  }

  deleteFoyer(id:number){
    this.foyerService.deleteFoyer(id).subscribe(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Le foyer a été supprimée avec succès',
        showConfirmButton: false,
        timer: 1500
      });
      this.getAllFoyer();
    });
  }
}
