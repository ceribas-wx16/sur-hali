document.addEventListener("DOMContentLoaded", () => {

    menuKontrol();

    cikisKontrol();

    resimYuklemeHazirla();

    kontrolEt();

});


// OTURUM KONTROLÜ

async function kontrolEt(){

    const { data } = await supabase.auth.getSession();


    if(!data.session){

        window.location.href = "admin-giris.html";

    }

}



// MENÜ

function menuKontrol(){

    const buttons =
    document.querySelectorAll(".menu-item");


    const pages =
    document.querySelectorAll(".page");


    buttons.forEach(button => {


        button.addEventListener("click", function(){


            if(this.id === "logoutButton"){
                return;
            }


            buttons.forEach(btn => {

                btn.classList.remove("active");

            });


            this.classList.add("active");



            pages.forEach(page => {

                page.classList.remove("active-page");

            });



            const target =
            document.getElementById(
                this.dataset.page
            );


            if(target){

                target.classList.add("active-page");

            }


        });


    });


}




// ÇIKIŞ

function cikisKontrol(){


    const button =
    document.getElementById(
        "logoutButton"
    );


    if(!button){
        return;
    }


    button.addEventListener(
        "click",
        async()=>{


            await supabase.auth.signOut();


            window.location.href =
            "admin-giris.html";


        }
    );


}





// RESİM

function resimYuklemeHazirla(){


    const button =
    document.getElementById(
        "uploadImageButton"
    );


    if(!button){
        return;
    }


    button.addEventListener(
        "click",
        ()=>{


            alert(
                "Resim yükleme modülü hazır."
            );


        }
    );


}
