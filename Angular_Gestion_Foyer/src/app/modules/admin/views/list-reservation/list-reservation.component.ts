import { Component } from '@angular/core';
import { Etudiant } from 'src/app/core/models/etudiant/etudiant';
import { Reservation } from 'src/app/core/models/reservation/reservation';
import { EtudiantService } from 'src/app/core/services/etudiant/etudiant.service';
import { ReservationService } from 'src/app/core/services/reservation/reservation.service';

@Component({
  selector: 'app-list-reservation',
  templateUrl: './list-reservation.component.html',
  styleUrls: ['./list-reservation.component.css']
})
export class ListReservationComponent {
  listEtudiant: Etudiant[] = [];
  etudiantReservations: { etudiant: Etudiant; reservation: Reservation }[] = [];

  constructor(
    private reservationService: ReservationService,
    public etudiantService: EtudiantService
  ) { }

  ngOnInit() {
    this.getAllEtudiants();
  }

  getAllEtudiants() {
    this.etudiantService.getAllEtudiants().subscribe((etudiants: Etudiant[]) => {
      this.listEtudiant = etudiants;
      console.log("etfffffffff",this.listEtudiant);
      this.listEtudiant.forEach(etudiant => {
        this.getReservationByIdEtudiant(etudiant.id);
      });
    });
  }

  getReservationByIdEtudiant(idEtudiant: number) {
    this.reservationService.getCurrentReservationByEtudiantId(idEtudiant).subscribe((reservation: Reservation) => {
      if (reservation) { // Vérifier si une réservation existe
        const etudiant = this.listEtudiant.find(e => e.id === idEtudiant);
        if (etudiant) {
          this.etudiantReservations.push({ etudiant, reservation });
        }
      }
    });
  }  
  
}