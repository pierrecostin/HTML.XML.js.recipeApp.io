class Recette {
        id;
        title;
        image;
        category;
        preptime;
        cooktime;
        portion;
        ingredientList;
        instructionList;

        constructor(id, title, image) {
            this.id = id;
            this.title = title;
            this.image = image;
        }
    }

    /*
     * ====================================================================
     * Début du script JS
     * ====================================================================
     */

    // Variables globales
    recettes = Array();
    let url = 'recettes.xml';
   
    // Après le chargement de la page HTML
    window.onload = function(e) {
		
		
		loadMeteo();

		
        fetch(url)
            .then(reponse => reponse.text())          // Recevoir, du serveur Web, une chaine de caractères contenant le XML
            .then(xmlText => remplirTableau(xmlText)) // Remplir le tableau d'objet avec les informations du XML
            .then(() => listeRecette(recettes));
		
				
				       // Afficher le titre des recette
		        document.getElementById("homepage").click();

	}
    /*
     * ===================================================================
     * Déclaration des fonctions
     * ===================================================================
     */
	
	function myFunction() {
		  var x = document.getElementById("myTopnav");
		  if (x.className === "topnav") {
			x.className += " responsive";
		  } else {
			x.className = "topnav";
		  }
		}
	
	
	function loadMeteo(){ 
		console.log("loadMeteo");
	let api_key = '6a3af1a2ffbb9904b1ffaf4b0848d2a1';  
	let url = 'http://api.openweathermap.org/data/2.5/weather?q=Montreal,  ca&mode=json&units=metric&appid=' + api_key;   
	fetch(url).then(reponse => reponse.json()) 
		.then(data => afficheJSON(data)); 
	} 

	function afficheJSON(objJSON){ 
		console.log(objJSON);
		let contenu = "<p>Météo</p>"; 
		contenu += "<p>Ville: " + objJSON.name + "</p>";
		contenu += "<div>" + objJSON.main.temp + " &#8451;</div>";   
		contenu += "<img src='http://openweathermap.org/img/w/" + objJSON.weather[0].icon + ".png'>";
		console.log(JSON);
	 	document.getElementById("meteo").innerHTML = contenu; 
	}
   
		function setClickListener() {
			
			
			 let cards = document.getElementsByClassName("card");
			 for(card of cards) {
				 card.addEventListener("click", function(e) { fillRecette(e)},false);
			 }
			
			
			let navbuttons = document.getElementsByClassName("navbutton");
			 for(button of navbuttons) {
				 button.addEventListener("click", function(e) { filtreRecettes(e)},false);
			 }
		}

       function filtreRecettes(category) {
		
		   document.getElementById('recette').style.display = 'block';
		   document.getElementById('fullRecette').style.display = 'none';
		   category = category.target.id;
		   let allRecettes = document.querySelectorAll('.card');
		   let filtreRecettes = document.querySelectorAll(`[data-category = ${category}]`);
		   if(category == "homepage") {
			   for(let rec of allRecettes){
			   rec.style.display = "block";
		      }
			  } else {
			 
		      for(let rec of allRecettes){
			      rec.style.display = "none";
		      }
		      for(let rec of filtreRecettes){
			   rec.style.display = "block";
		      }
			  
			  }
		   
	   }

       function remplirTableau(xmlText) {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlText, "application/xml"); // la variable xmlDoc contient maintenat un document XML

        let tabRecettes = xmlDoc.getElementsByTagName("recipe"); // la variable tabRecettes contient un tableaux de recettes XML

        for (let i = 0; i < tabRecettes.length; i++) {
            let recette = new Recette(); // Créer une nouvelle recette

            recette.id = +tabRecettes[i].getAttribute("id");
            recette.title = tabRecettes[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
            recette.image = tabRecettes[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;
            recette.category = tabRecettes[i].getElementsByTagName("category")[0].childNodes[0].nodeValue;
            recette.preptime = tabRecettes[i].getElementsByTagName("preptime")[0].childNodes[0].nodeValue;
            recette.cooktime = tabRecettes[i].getElementsByTagName("cooktime")[0].childNodes[0].nodeValue;
            recette.portion = tabRecettes[i].getElementsByTagName("yield")[0].childNodes[0].nodeValue;

            let tabIngredient = tabRecettes[i].getElementsByTagName("ingredient_list")[0].getElementsByTagName("ingredient");
            recette.ingredientList = Array();
            for (let j = 0; j < tabIngredient.length; j++) {
                recette.ingredientList.push(tabIngredient[j].childNodes[0].nodeValue);
                
            }
            let tabInstruction = tabRecettes[i].getElementsByTagName("instruction_list")[0].getElementsByTagName("instruction");
            recette.instructionList = Array();
            for (let j = 0; j < tabInstruction.length; j++) {
                recette.instructionList.push(tabInstruction[j].childNodes[0].nodeValue);
                
            }

            this.recettes.push(recette); // Ajouter la recette dans le tableau de recettes
        }
    }

       function fillRecette(event) {
		   let targ = event.target;
		   let parent = "";
		   document.getElementById('recette').style.display = 'none';
		   document.getElementById('fullRecette').style.display = 'block';
		   
		   if(targ.localName == "img" || targ.localName == "h6"){
			   parent = targ.parentElement;
			  }  else {
				  parent = targ;
			  }
		   console.log(parent.getAttribute("data-portion"));
		   
		   
		   
		   document.getElementById('frImg').setAttribute('src', parent.children[0].src);
		   
		   
		   document.getElementById('card2').innerHTML = (parent.getAttribute("data-title"));
		   
		  
		   document.getElementById('prep').innerHTML = ("Temps de Préparation: " + parent.getAttribute("data-t2p"));
		   
		   document.getElementById('cook').innerHTML = ("Temps de Cuisson: " + parent.getAttribute("data-cooktime"));

		   document.getElementById('portion').innerHTML = ("Portions: " + parent.getAttribute("data-portion"));
		   
		   document.getElementById('card4').innerHTML = ("INGREDIENTS: " + parent.getAttribute("data-ingredients"));
		   
		   document.getElementById('card5').innerHTML = ("METHODE DE CUISSON: " + parent.getAttribute("data-instruction"));
	   }

       function listeRecette(liste) {
        for (let i = 0; i < liste.length; i++) {
			let contenu = "<div class=\"column\">";
			contenu += "<div class=\"card\" data-t2p=\""+liste[i].preptime +"\" data-portion=\""+liste[i].portion +"\" data-instruction=\""+liste[i].instructionList +"\" data-cooktime=\""+liste[i].cooktime +"\" data-category=\""+liste[i].category +"\" data-category=\""+liste[i].category +"\" data-title=\""+liste[i].title+"\" data-ingredients=\""+liste[i].ingredientList +"\">";
			
			contenu += "<img src=\"img/"+liste[i].image+"\">";
            contenu += "<h6>" + liste[i].title + "</h6>";
			contenu += '</div>';
			contenu += '</div>';
			document.getElementById("recette").innerHTML += contenu;
        }
		  setClickListener();
		  document.getElementById("homepage").click();
    }
