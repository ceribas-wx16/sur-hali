document.addEventListener("DOMContentLoaded", () => {

    menuKontrol();

    cikisKontrol();

    resimYuklemeHazirla();

    resimleriGetir();

    kontrolEt();

});




// OTURUM KONTROLÜ

async function kontrolEt(){

    const { data } =
    await supabase.auth.getSession();


    if(!data.session){

        window.location.href =
        "admin-giris.html";

    }

}






// MENÜ KONTROLÜ

function menuKontrol(){


    const buttons =
    document.querySelectorAll(
        ".menu-item"
    );


    const pages =
    document.querySelectorAll(
        ".page"
    );



    buttons.forEach(button=>{


        button.addEventListener(
            "click",
            ()=>{


                if(button.id === "logoutButton"){
                    return;
                }



                buttons.forEach(btn=>{

                    btn.classList.remove(
                        "active"
                    );

                });



                button.classList.add(
                    "active"
                );




                pages.forEach(page=>{

                    page.classList.remove(
                        "active-page"
                    );

                });





                const target =
                document.getElementById(
                    button.dataset.page
                );



                if(target){

                    target.classList.add(
                        "active-page"
                    );

                }



            }
        );


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



    button.onclick =
    async()=>{


        await supabase.auth.signOut();


        window.location.href =
        "admin-giris.html";


    };


}








// STORAGE RESİMLERİNİ GETİR

async function resimleriGetir(){


    const gallery =
    document.getElementById(
        "imageGallery"
    );


    if(!gallery){

        return;

    }



    const { data, error } =
    await supabase
    .storage
    .from("halilar")
    .list();



    if(error){

        console.log(error);

        return;

    }



    gallery.innerHTML = "";




    data.forEach(file=>{


        const { data:url } =
        supabase
        .storage
        .from("halilar")
        .getPublicUrl(
            file.name
        );



        gallery.innerHTML += `

        <div class="image-card">

            <img src="${url.publicUrl}">

            <p>${file.name}</p>

        </div>

        `;


    });





    const totalImages =
    document.getElementById(
        "totalImages"
    );


    if(totalImages){

        totalImages.innerText =
        data.length;

    }


}









// RESİM YÜKLEME

function resimYuklemeHazirla(){


    const button =
    document.getElementById(
        "uploadImageButton"
    );


    const input =
    document.getElementById(
        "imageInput"
    );



    if(!button){

        return;

    }




    button.onclick =
    async()=>{



        const file =
        input.files[0];



        if(!file){


            alert(
                "Lütfen önce resim seçin."
            );


            return;

        }




        const fileName =
        Date.now()
        +
        "-"
        +
        file.name;





        const { error } =
        await supabase
        .storage
        .from("halilar")
        .upload(
            fileName,
            file
        );




        if(error){


            console.log(error);


            alert(
                "Yükleme hatası: "
                +
                error.message
            );


            return;

        }





        alert(
            "Resim başarıyla yüklendi."
        );



        input.value = "";



        resimleriGetir();



    };


}
