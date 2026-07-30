document.addEventListener("DOMContentLoaded", () => {

    menuKontrol();

    cikisKontrol();

    resimYuklemeHazirla();

    resimleriGetir();

    modalHazirla();

    urunleriGetir();

    urunKaydetHazirla();

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






// MENÜ

function menuKontrol(){

    const buttons =
    document.querySelectorAll(".menu-item");


    const pages =
    document.querySelectorAll(".page");



    buttons.forEach(button=>{


        button.addEventListener(
            "click",
            ()=>{


                if(button.id === "logoutButton"){
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








// RESİMLERİ GETİR

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



        const div =
        document.createElement(
            "div"
        );


        div.className =
        "image-card";



        div.innerHTML = `

            <img src="${url.publicUrl}">

            <p>${file.name}</p>

            <button class="delete-image">
                Sil
            </button>

        `;



        const deleteButton =
        div.querySelector(
            ".delete-image"
        );



        deleteButton.onclick =
        ()=>{

            resimSil(
                file.name
            );

        };



        gallery.appendChild(
            div
        );


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








// RESİM SİLME

async function resimSil(fileName){


    const onay =
    confirm(
        "Bu resmi silmek istediğinize emin misiniz?"
    );


    if(!onay){

        return;

    }



    const { error } =
    await supabase
    .storage
    .from("halilar")
    .remove([
        fileName
    ]);



    if(error){


        alert(
            "Silme hatası: "
            +
            error.message
        );


        console.log(error);


        return;

    }



    alert(
        "Resim silindi."
    );


    resimleriGetir();


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
// =========================
// MODAL
// =========================

function modalHazirla(){

    const modal =
    document.getElementById("productModal");

    const openButton =
    document.getElementById("newProductButton");

    const closeButton =
    document.getElementById("closeModal");

    if(!modal) return;

    openButton.onclick = ()=>{

        modal.style.display="flex";

    };

    closeButton.onclick = ()=>{

        modal.style.display="none";

    };

    window.onclick=(e)=>{

        if(e.target===modal){

            modal.style.display="none";

        }

    };

}
// =========================
// ÜRÜNLERİ GETİR
// =========================

async function urunleriGetir(){

    const tbody =
    document.getElementById(
        "productTableBody"
    );

    if(!tbody) return;

    tbody.innerHTML="";

    const { data, error } =
    await supabase
    .from("products")
    .select("*")
    .order("created_at",{ascending:false});

    if(error){

        console.log(error);

        return;

    }

    data.forEach(product=>{

        tbody.innerHTML+=`

        <tr>

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>

               ${product.is_active
? "Aktif"
: "Pasif"}

            </td>

            <td>

                <button>

                    Düzenle

                </button>

                <button>

                    Sil

                </button>

            </td>

        </tr>

        `;

    });

    const total =
    document.getElementById(
        "totalProducts"
    );

    if(total){

        total.innerText =
        data.length;

    }

}
// =========================
// ÜRÜN KAYDET
// =========================

function urunKaydetHazirla(){
    function urunKaydetHazirla(){

    alert("Fonksiyon çalıştı");

    const button =
    document.getElementById("saveProductButton");

    ...
}

    const button =
    document.getElementById("saveProductButton");

    if(!button) return;

    button.onclick = async()=>{

        const name =
        document.getElementById("productName").value.trim();

        const category =
        document.getElementById("productCategory").value.trim();

        const size =
        document.getElementById("productSize").value.trim();

        const price =
        Number(document.getElementById("productPrice").value);

        const description =
        document.getElementById("productDescription").value.trim();

        const image =
        document.getElementById("productImage").files[0];

        if(name==="" || category===""){

            alert("Ürün adı ve kategori zorunludur.");

            return;

        }

        let imageUrl = "";

        if(image){

            const fileName =
            Date.now() + "-" + image.name;

            const { error:uploadError } =
            await supabase
            .storage
            .from("halilar")
            .upload(fileName,image);

            if(uploadError){

                alert(uploadError.message);

                return;

            }

            imageUrl =
            supabase
            .storage
            .from("halilar")
            .getPublicUrl(fileName)
            .data
            .publicUrl;

        }

        const { error } =
        await supabase
        .from("products")
        .insert({

            name,

            category,

            size,

            price,

            description,

            image_url:imageUrl,

            is_active:true

        });

        if(error){

            console.log(error);

            alert(error.message);

            return;

        }

        alert("Ürün başarıyla eklendi.");

        document.getElementById("productModal").style.display="none";

        document.getElementById("productName").value="";
        document.getElementById("productCategory").value="";
        document.getElementById("productSize").value="";
        document.getElementById("productPrice").value="";
        document.getElementById("productDescription").value="";
        document.getElementById("productImage").value="";

        urunleriGetir();

    };

}
