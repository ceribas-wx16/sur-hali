document.addEventListener("DOMContentLoaded", () => {

    kontrolEt();

    menuKontrol();

    cikisKontrol();

    modalHazirla();

    resimYuklemeHazirla();

    resimleriGetir();

    urunleriGetir();

    urunKaydetHazirla();

});


// =========================
// OTURUM KONTROLÜ
// =========================

async function kontrolEt(){

    const { data } =
    await supabase.auth.getSession();

    if(!data.session){

        window.location.href =
        "admin-giris.html";

    }

}


// =========================
// MENÜ
// =========================

function menuKontrol(){

    const buttons =
    document.querySelectorAll(".menu-item");

    const pages =
    document.querySelectorAll(".page");

    buttons.forEach(button=>{

        button.onclick=()=>{

            if(button.id==="logoutButton") return;

            buttons.forEach(btn=>{

                btn.classList.remove("active");

            });

            pages.forEach(page=>{

                page.classList.remove("active-page");

            });

            button.classList.add("active");

            const target =
            document.getElementById(
                button.dataset.page
            );

            if(target){

                target.classList.add(
                    "active-page"
                );

            }

        };

    });

}


// =========================
// ÇIKIŞ
// =========================

function cikisKontrol(){

    const button =
    document.getElementById(
        "logoutButton"
    );

    if(!button) return;

    button.onclick =
    async()=>{

        await supabase.auth.signOut();

        window.location.href =
        "admin-giris.html";

    };

}


// =========================
// MODAL
// =========================

function modalHazirla(){

    const modal =
    document.getElementById(
        "productModal"
    );

    if(!modal) return;

    document.getElementById(
        "newProductButton"
    ).onclick=()=>{

        modal.style.display="flex";

    };

    document.getElementById(
        "closeModal"
    ).onclick=()=>{

        modal.style.display="none";

    };

    window.addEventListener("click",(e)=>{

        if(e.target===modal){

            modal.style.display="none";

        }

    });

}


// =========================
// RESİMLERİ GETİR
// =========================

async function resimleriGetir(){

    const gallery =
    document.getElementById(
        "imageGallery"
    );

    if(!gallery) return;

    gallery.innerHTML="";

    const { data,error } =
    await supabase
    .storage
    .from("halilar")
    .list();

    if(error){

        console.log(error);

        return;

    }

    for(const file of data){

        const { data:url } =
        supabase
        .storage
        .from("halilar")
        .getPublicUrl(file.name);

        gallery.innerHTML += `

        <div class="image-card">

            <img src="${url.publicUrl}">

            <p>${file.name}</p>

            <button
                class="delete-image"
                onclick="resimSil('${file.name}')">

                🗑️ Sil

            </button>

        </div>

        `;

    }

    document.getElementById(
        "totalImages"
    ).innerText=data.length;

}
// =========================
// RESİM SİL
// =========================

async function resimSil(fileName){

    if(!confirm("Bu resmi silmek istiyor musunuz?")){

        return;

    }

    const { error } =
    await supabase
    .storage
    .from("halilar")
    .remove([fileName]);

    if(error){

        alert(error.message);

        return;

    }

    alert("Resim silindi.");

    resimleriGetir();

}


// =========================
// RESİM YÜKLE
// =========================

function resimYuklemeHazirla(){

    const button =
    document.getElementById("uploadImageButton");

    if(!button) return;

    button.onclick = async()=>{

        const file =
        document.getElementById("imageInput").files[0];

        if(!file){

            alert("Lütfen bir resim seçiniz.");

            return;

        }

        const fileName =
        Date.now() + "-" + file.name;

        const { error } =
        await supabase
        .storage
        .from("halilar")
        .upload(fileName,file);

        if(error){

            alert(error.message);

            return;

        }

        alert("Resim yüklendi.");

        document.getElementById("imageInput").value="";

        resimleriGetir();

    };

}


// =========================
// ÜRÜNLERİ GETİR
// =========================

async function urunleriGetir(){

    const tbody =
    document.getElementById("productTableBody");

    if(!tbody) return;

    tbody.innerHTML="";

    const { data,error } =
    await supabase
    .from("products")
    .select("*")
    .order("created_at",{ascending:false});

    if(error){

        console.log(error);

        return;

    }

    data.forEach(product=>{

        tbody.innerHTML += `

        <tr>

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>${product.is_active ? "Aktif" : "Pasif"}</td>

            <td>

                <button>Düzenle</button>

                <button>Sil</button>

            </td>

        </tr>

        `;

    });

    document.getElementById("totalProducts").innerText =
    data.length;

}


// =========================
// ÜRÜN KAYDET
// =========================
function urunKaydetHazirla(){

    const button =
    document.getElementById("saveProductButton");

    console.log("Kaydet butonu:", button);

    if(!button){

        console.log("saveProductButton bulunamadı.");

        return;

    }

    button.onclick = async()=>{

        console.log("Kaydet butonuna basıldı.");

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

            const { error: uploadError } =
            await supabase
            .storage
            .from("halilar")
            .upload(fileName,image);

            if(uploadError){

                alert(uploadError.message);

                console.log(uploadError);

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
        .insert([{

            name: name,

            category: category,

            size: size,

            price: price,

            description: description,

            image_url: imageUrl,

            is_active: true

        }]);

        if(error){

            console.log(error);

            alert(error.message);

            return;

        }

        alert("Ürün başarıyla eklendi.");

        document.getElementById("productName").value = "";
        document.getElementById("productCategory").value = "";
        document.getElementById("productSize").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productDescription").value = "";
        document.getElementById("productImage").value = "";

        document.getElementById("productModal").style.display = "none";

        urunleriGetir();

    };

}
