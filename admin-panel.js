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






// MENÜ KONTROLÜ

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


    const gallery =
    document.getElementById(
        "imageGallery"
    );



    if(!button){

        return;

    }




    button.addEventListener(
        "click",
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








            const { data } =
            supabase
            .storage
            .from("halilar")
            .getPublicUrl(
                fileName
            );







            gallery.innerHTML += `

                <div class="image-card">

                    <img src="${data.publicUrl}">

                    <p>${fileName}</p>

                </div>

            `;





            alert(
                "Resim başarıyla yüklendi."
            );



        }
    );


}
