document.addEventListener("DOMContentLoaded", async () => {

    await kontrolEt();

    menuKontrol();

    cikisKontrol();

    resimYuklemeHazirla();

});


// =============================
// OTURUM KONTROLÜ
// =============================

async function kontrolEt(){

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();


    if(error){

        console.log(error);

        return;

    }


    if(!session){

        window.location.href = "admin-giris.html";

    }

}



// =============================
// MENÜ GEÇİŞLERİ
// =============================

function menuKontrol(){

    const buttons =
    document.querySelectorAll(".menu-item");


    const pages =
    document.querySelectorAll(".page");


    buttons.forEach(button => {


        button.addEventListener("click",()=>{


            if(button.id === "logoutButton"){
                return;
            }


            buttons.forEach(btn => {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            pages.forEach(page => {

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



// =============================
// ÇIKIŞ
// =============================

function cikisKontrol(){

    const logoutButton =
    document.getElementById(
        "logoutButton"
    );


    if(!logoutButton){

        return;

    }


    logoutButton.addEventListener(
        "click",
        async()=>{


            await supabaseClient.auth.signOut();


            window.location.href =
            "admin-giris.html";


        }
    );

}



// =============================
// RESİM YÜKLEME
// =============================

function resimYuklemeHazirla(){


    const uploadButton =
    document.getElementById(
        "uploadImageButton"
    );


    const imageInput =
    document.getElementById(
        "imageInput"
    );


    const gallery =
    document.getElementById(
        "imageGallery"
    );


    if(
        !uploadButton ||
        !imageInput ||
        !gallery
    ){

        return;

    }



    uploadButton.addEventListener(
        "click",
        async()=>{


            const file =
            imageInput.files[0];


            if(!file){

                alert(
                    "Lütfen resim seçin."
                );

                return;

            }



            const fileName =
            Date.now()
            +
            "-"
            +
            file.name;



            const {
                data,
                error
            } =
            await supabaseClient
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




            const {
                data:urlData
            } =
            supabaseClient
            .storage
            .from("halilar")
            .getPublicUrl(
                fileName
            );



            const imageUrl =
            urlData.publicUrl;



            gallery.innerHTML += `

                <div class="image-card">

                    <img 
                    src="${imageUrl}"
                    alt="Sur Halı">

                    <p>
                    ${fileName}
                    </p>

                </div>

            `;



            imageInput.value = "";


            alert(
                "Resim başarıyla yüklendi."
            );


        }
    );


}
