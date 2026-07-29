document.addEventListener("DOMContentLoaded", async () => {

    await kontrolEt();

    menuKontrol();

    cikisKontrol();

    resimYuklemeHazirla();

});


// OTURUM KONTROLÜ

async function kontrolEt(){

    const {
        data:{session}
    } = await supabase.auth.getSession();


    if(!session){

        window.location.href="admin-giris.html";

    }

}



// MENÜLER

function menuKontrol(){

    const buttons =
    document.querySelectorAll(".menu-item");


    const pages =
    document.querySelectorAll(".page");


    buttons.forEach(button=>{


        button.addEventListener("click",()=>{


            if(button.id==="logoutButton"){
                return;
            }


            buttons.forEach(btn=>{
                btn.classList.remove("active");
            });


            button.classList.add("active");


            pages.forEach(page=>{
                page.classList.remove("active-page");
            });


            const target =
            document.getElementById(
                button.dataset.page
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


    button.onclick = async()=>{


        await supabase.auth.signOut();


        window.location.href =
        "admin-giris.html";


    };


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


    button.onclick=()=>{

        alert(
            "Resim sistemi hazırlanıyor."
        );

    };

}
