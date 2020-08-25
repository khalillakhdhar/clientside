import { Component, OnInit } from "@angular/core";
import { Produitservice } from "../services/produit.service";
import { Produit } from "../classes/produit";
import { Commandeservice } from "../services/commande.service";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  produits: any;
  public search: any = "";
  query: any;
  user: any;
  users: any;
  cuse: any;
  constructor(
    public produitService: Produitservice,
    public commandeService: Commandeservice,
    private usser: UserService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.getUser();
    this.getproduits();
  }
  getUser() {
    this.usser.read_User().subscribe((data) => {
      this.users = data.map((e) => {
        return {
          id: e.payload.doc.id,

          // tslint:disable-next-line: no-string-literal
          displayName: e.payload.doc.data()["displayName"],
          // tslint:disable-next-line: no-string-literal
          adresse: e.payload.doc.data()["adresse"],
          // tslint:disable-next-line: no-string-literal
          phoneNumber: e.payload.doc.data()["phoneNumber"],

          // tslint:disable-next-line: no-string-literal
        };
      });
      console.log(this.users);
      for (let u of this.users) {
        if (u.id === this.user.uid) {
          this.cuse = u;
          console.log("currently ", this.cuse);
        }
      }
    });
  }
  getproduits() {
    this.produitService.read_Produits().subscribe((data) => {
      this.produits = data.map((e) => {
        return {
          id: e.payload.doc.id,

          // tslint:disable-next-line: no-string-literal
          titre: e.payload.doc.data()["titre"],
          // tslint:disable-next-line: no-string-literal
          prix: e.payload.doc.data()["prix"],
          // tslint:disable-next-line: no-string-literal
          categorie: e.payload.doc.data()["categorie"],

          // tslint:disable-next-line: no-string-literal
          description: e.payload.doc.data()["description"],

          // tslint:disable-next-line: no-string-literal
          photo: e.payload.doc.data()["photo"],
          
          // tslint:disable-next-line: no-string-literal
        };
      });
      console.log(this.produits);
    });
  }
  add(pr) {
    if (this.user != null) {
      pr.adresse = this.cuse.adresse;
      pr.tel = this.cuse.phoneNumber;
      pr.iduser = this.cuse.id;
      pr.etat = "en cours";
      pr.quantite = 1;
      let p = Object.assign(pr);

      p.acheteur = this.cuse.displayName;
      this.commandeService.create_NewCommande(p);
      // window.location.replace("cart");
    } else {
      alert("veuillez vous connecté!");
      window.location.replace("login");
    }
  }
}
