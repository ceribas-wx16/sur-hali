/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   Bölüm 1
   - Başlatma
   - Oturum Kontrolü
   - Menü
   - Çıkış
========================================================== */

console.clear();
console.log("Sur Halı Admin Panel Başlatılıyor...");

/* ==========================================================
   SAYFA YÜKLENDİ
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await oturumKontrol();

        menuHazirla();

        cikisHazirla();

        modalHazirla();

        await dashboardYukle();

        await urunleriGetir();

        await resimleriGetir();

        await ayarlariGetir();

        console.log("Admin Panel Hazır");

    } catch (err) {

        console.error("Başlatma hatası:", err);

    }

});


/* ==========================================================
   OTURUM KONTROLÜ
========================================================== */

async function oturumKontrol() {

    const { data, error } =
        await supabase.auth.getSession();

    if (error) {

        console.error(error);

        window.location.href = "admin-giris.html";

        return;

    }

    if (!data.session) {

        window.location.href = "admin-giris.html";

        return;

    }

    console.log(
        "Giriş:",
        data.session.user.email
    );

}


/* ==========================================================
   SOL MENÜ
========================================================== */

function menuHazirla() {

    const menuItems =
        document.querySelectorAll(".menu-item");

    const pages =
        document.querySelectorAll(".page");

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            if (item.id === "logoutButton")
                return;

            menuItems.forEach(button =>
                button.classList.remove("active")
            );

            pages.forEach(page =>
                page.classList.remove("active-page")
            );

            item.classList.add("active");

            const target =
                document.getElementById(
                    item.dataset.page
                );

            if (target) {

                target.classList.add(
                    "active-page"
                );

            }

        });

    });

}


/* ==========================================================
   MODAL
========================================================== */

function modalHazirla() {

    const modal =
        document.getElementById("productModal");

    const openButton =
        document.getElementById("newProductButton");

    const closeButton =
        document.getElementById("closeModal");

    if (!modal)
        return;

    openButton?.addEventListener("click", () => {

        modal.style.display = "flex";

    });

    closeButton?.addEventListener("click", () => {

        modal.style.display = "none";

    });

    window.addEventListener("click", (e) => {

        if (e.target === modal) {

            modal.style.display = "none";

        }

    });

}


/* ==========================================================
   ÇIKIŞ
========================================================== */

function cikisHazirla() {

    const logoutButton =
        document.getElementById("logoutButton");

    if (!logoutButton)
        return;

    logoutButton.addEventListener("click", async () => {

        const cevap =
            confirm("Çıkış yapmak istiyor musunuz?");

        if (!cevap)
            return;

        try {

            await supabase.auth.signOut();

            window.location.href =
                "admin-giris.html";

        } catch (err) {

            console.error(err);

            alert("Çıkış yapılamadı.");

        }

    });

}

/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   Bölüm 2
   Dashboard
========================================================== */


/* ==========================================================
   DASHBOARD
========================================================== */

async function dashboardYukle() {

    console.log("Dashboard yükleniyor...");

    await toplamUrunSayisi();

    await toplamResimSayisi();

    await storageBilgisi();

}


/* ==========================================================
   TOPLAM ÜRÜN SAYISI
========================================================== */

async function toplamUrunSayisi() {

    try {

        const { count, error } = await supabase
            .from("products")
            .select("*", {
                count: "exact",
                head: true
            });

        if (error) {

            console.error(error);

            return;

        }

        const alan =
            document.getElementById("totalProducts");

        if (alan) {

            alan.textContent = count || 0;

        }

    }

    catch (err) {

        console.error(err);

    }

}


/* ==========================================================
   TOPLAM RESİM SAYISI
========================================================== */

async function toplamResimSayisi() {

    try {

        const { data, error } =
            await supabase.storage
                .from("halilar")
                .list();

        if (error) {

            console.error(error);

            return;

        }

        const alan =
            document.getElementById("totalImages");

        if (alan) {

            alan.textContent =
                data ? data.length : 0;

        }

    }

    catch (err) {

        console.error(err);

    }

}


/* ==========================================================
   STORAGE KULLANIMI
========================================================== */

async function storageBilgisi() {

    try {

        const { data, error } =
            await supabase.storage
                .from("halilar")
                .list();

        if (error) {

            console.error(error);

            return;

        }

        let toplam = 0;

        data.forEach(file => {

            if (file.metadata?.size) {

                toplam += Number(file.metadata.size);

            }

        });

        let sonuc = "0 B";

        if (toplam >= 1024 && toplam < 1024 * 1024) {

            sonuc =
                (toplam / 1024).toFixed(1) + " KB";

        }

        if (toplam >= 1024 * 1024) {

            sonuc =
                (toplam / 1024 / 1024).toFixed(2) + " MB";

        }

        const alan =
            document.getElementById("storageUsage");

        if (alan) {

            alan.textContent = sonuc;

        }

    }

    catch (err) {

        console.error(err);

    }

}


/* ==========================================================
   AYARLARI GETİR
========================================================== */

async function ayarlariGetir() {

    try {

        const { data, error } =
            await supabase
                .from("settings")
                .select("*")
                .limit(1)
                .maybeSingle();

        if (error) {

            console.log("Settings tablosu kullanılmıyor.");

            return;

        }

        if (!data)
            return;

        const title =
            document.getElementById("siteTitle");

        const phone =
            document.getElementById("sitePhone");

        const address =
            document.getElementById("siteAddress");

        if (title)
            title.value = data.site_title || "";

        if (phone)
            phone.value = data.phone || "";

        if (address)
            address.value = data.address || "";

    }

    catch (err) {

        console.error(err);

    }

}

/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   Bölüm 3-A
   Ürünleri Listele
========================================================== */


/* ==========================================================
   ÜRÜNLERİ GETİR
========================================================== */

async function urunleriGetir() {

    console.log("Ürünler yükleniyor...");

    const tbody =
        document.getElementById("productTableBody");

    if (!tbody)
        return;

    tbody.innerHTML = "";

    try {

        const { data, error } =
            await supabase
                .from("products")
                .select("*")
                .order("created_at", {
                    ascending: false
                });

        if (error) {

            console.error(error);

            return;

        }

        if (!data || data.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="text-align:center;padding:35px;">
                        Henüz ürün bulunmuyor.
                    </td>
                </tr>
            `;

            return;

        }

        data.forEach(urun => {

            urunSatiriOlustur(urun);

        });

        console.log(
            data.length + " ürün listelendi."
        );

    }

    catch(err){

        console.error(err);

    }

}


/* ==========================================================
   TABLO SATIRI OLUŞTUR
========================================================== */

function urunSatiriOlustur(urun){

    const tbody =
        document.getElementById("productTableBody");

    const tr =
        document.createElement("tr");

    tr.innerHTML = `

        <td>

            <strong>${urun.name}</strong><br>

            <small>${urun.size || ""}</small>

        </td>

        <td>

            ${urun.category}

        </td>

        <td>

            ${
                urun.is_active
                ? "🟢 Aktif"
                : "🔴 Pasif"
            }

        </td>

        <td>

            <button
                class="editButton"
                data-id="${urun.id}">

                Düzenle

            </button>

            <button
                class="deleteButton"
                data-id="${urun.id}">

                Sil

            </button>

        </td>

    `;

    tbody.appendChild(tr);

}
function urunSatiriOlustur(urun){

...
}

/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   Bölüm 3-B
   Düzenle / Sil Butonları
========================================================== */


/* ==========================================================
   BUTONLARI AKTİF ET
========================================================== */

document.addEventListener("click", async (e) => {

    /* -------------------------
       ÜRÜN SİL
    ------------------------- */

    if (e.target.classList.contains("deleteButton")) {

        const id = e.target.dataset.id;

        const cevap =
            confirm("Bu ürünü silmek istediğinize emin misiniz?");

        if (!cevap)
            return;

        try {

            const { error } =
                await supabase
                    .from("products")
                    .delete()
                    .eq("id", id);

            if (error)
                throw error;

            alert("Ürün silindi.");

            await urunleriGetir();

            await toplamUrunSayisi();

        }

        catch (err) {

            console.error(err);

            alert("Ürün silinemedi.");

        }

    }


    /* -------------------------
       ÜRÜN DÜZENLE
    ------------------------- */

    if (e.target.classList.contains("editButton")) {

        const id =
            e.target.dataset.id;

        await urunBilgileriniYukle(id);

    }

});


/* ==========================================================
   ÜRÜN BİLGİLERİNİ MODALA YÜKLE
========================================================== */

async function urunBilgileriniYukle(id){

    try{

        const { data, error } =
            await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();

        if(error)
            throw error;

        document.getElementById("productName").value =
            data.name || "";

        document.getElementById("productCategory").value =
            data.category || "";

        document.getElementById("productSize").value =
            data.size || "";

        document.getElementById("productPrice").value =
            data.price || "";

        document.getElementById("productDescription").value =
            data.description || "";

        document
            .getElementById("saveProductButton")
            .dataset.editId = id;

        document
            .getElementById("productModal")
            .style.display = "flex";

    }

    catch(err){

        console.error(err);

        alert("Ürün bilgileri alınamadı.");

    }

}
/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   Bölüm 3C-1
   Ürün Kaydet
========================================================== */


/* ==========================================================
   KAYDET BUTONU
========================================================== */

const saveProductButton =
document.getElementById("saveProductButton");

if(saveProductButton){

    saveProductButton.addEventListener(
        "click",
        urunKaydet
    );

}


/* ==========================================================
   ÜRÜN KAYDET
========================================================== */

async function urunKaydet(){

try{

const id =
saveProductButton.dataset.editId || null;


const name =
document.getElementById("productName")
.value.trim();

const category =
document.getElementById("productCategory")
.value.trim();

const size =
document.getElementById("productSize")
.value.trim();

const price =
Number(
document.getElementById("productPrice")
.value
);

const description =
document.getElementById("productDescription")
.value.trim();

const file =
document.getElementById("productImage")
.files[0];


/* ==========================================================
   ZORUNLU ALANLAR
========================================================== */

if(name===""){

    alert("Ürün adı zorunludur.");

    return;

}

if(category===""){

    alert("Kategori seçiniz.");

    return;

}

let imageUrl = "";
   /* ==========================================================
   RESİM YÜKLEME
========================================================== */

if(file){

    const dosyaAdi =
        Date.now() + "-" + file.name.replace(/\s+/g, "_");

    const { error: uploadError } =
        await supabase.storage
            .from("halilar")
            .upload(dosyaAdi, file);

    if(uploadError){

        console.error(uploadError);

        alert("Resim yüklenemedi.");

        return;

    }

    const { data: publicData } =
        supabase.storage
            .from("halilar")
            .getPublicUrl(dosyaAdi);

    imageUrl = publicData.publicUrl;

}

/* ==========================================================
   KAYIT NESNESİ
========================================================== */

const urun = {

    name: name,

    category: category,

    size: size,

    price: price,

    description: description,

    is_active: true

};


/* ==========================================================
   RESİM URL'Sİ VARSA EKLE
========================================================== */

if(imageUrl !== ""){

    urun.image_url = imageUrl;

}
   /* ==========================================================
   VERİTABANINA KAYDET
========================================================== */

if(id){

    const { error } =
        await supabase
            .from("products")
            .update(urun)
            .eq("id", id);

    if(error){

        console.error(error);

        alert("Ürün güncellenemedi.");

        return;

    }

    alert("Ürün başarıyla güncellendi.");

}

else{

    const { error } =
        await supabase
            .from("products")
            .insert([urun]);

    if(error){

        console.error(error);

        alert("Ürün eklenemedi.");

        return;

    }

    alert("Ürün başarıyla eklendi.");

}
   /* ==========================================================
   FORMU TEMİZLE
========================================================== */

document.getElementById("productName").value = "";

document.getElementById("productCategory").value = "";

document.getElementById("productSize").value = "";

document.getElementById("productPrice").value = "";

document.getElementById("productDescription").value = "";

document.getElementById("productImage").value = "";

delete saveProductButton.dataset.editId;


/* ==========================================================
   MODALI KAPAT
========================================================== */

const modal =
document.getElementById("productModal");

if(modal){

    modal.style.display = "none";

}


/* ==========================================================
   TABLOLARI YENİLE
========================================================== */

await dashboardYukle();

await urunleriGetir();

await resimleriGetir();

}
catch(err){

    console.error(err);

    alert("Ürün kaydedilirken hata oluştu.");

}

}

/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   Bölüm 4-A
   Resimleri Listele
========================================================== */

async function resimleriGetir(){

try{

const galeri =
document.getElementById("imageGallery");

if(!galeri)
return;

galeri.innerHTML="";

const { data, error } =
await supabase.storage
.from("halilar")
.list("",{

limit:100,

sortBy:{
column:"created_at",
order:"desc"
}

});

if(error){

console.error(error);

return;

}

if(!data || data.length===0){

galeri.innerHTML=`

<div
style="
padding:40px;
text-align:center;
color:#666;
">

Henüz resim bulunmuyor.

</div>

`;

return;

}

data.forEach(resim=>{

const url =
supabase.storage
.from("halilar")
.getPublicUrl(resim.name)
.data.publicUrl;

const kart =
document.createElement("div");

kart.className="image-card";

kart.innerHTML=`

<img
src="${url}"
alt=""
>

<div class="image-name">

${resim.name}

</div>

<button
class="deleteImageButton"
data-name="${resim.name}">

Resmi Sil

</button>

`;

galeri.appendChild(kart);

});

}
catch(err){

console.error(err);

}

}
/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   Bölüm 4-B
   Resim Sil
========================================================== */

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("deleteImageButton"))
        return;

    const dosyaAdi =
        e.target.dataset.name;

    const cevap =
        confirm("Bu resmi silmek istiyor musunuz?");

    if (!cevap)
        return;

    try {

        const { error } =
            await supabase.storage
                .from("halilar")
                .remove([dosyaAdi]);

        if (error)
            throw error;

        alert("Resim silindi.");

        await resimleriGetir();

        await toplamResimSayisi();

        await storageBilgisi();

    }

    catch (err) {

        console.error(err);

        alert("Resim silinemedi.");

    }

});

/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   Bölüm 4-C
   Site Ayarlarını Kaydet
========================================================== */

const settingsForm =
document.getElementById("settingsForm");

if(settingsForm){

    settingsForm.addEventListener(
        "submit",
        ayarlariKaydet
    );

}

async function ayarlariKaydet(e){

e.preventDefault();

try{

const site_title =
document.getElementById("siteTitle").value.trim();

const phone =
document.getElementById("sitePhone").value.trim();

const address =
document.getElementById("siteAddress").value.trim();

const { data } =
await supabase
.from("settings")
.select("id")
.limit(1)
.maybeSingle();

if(data){

const { error } =
await supabase
.from("settings")
.update({

site_title,

phone,

address

})
.eq("id",data.id);

if(error)
throw error;

}
else{

const { error } =
await supabase
.from("settings")
.insert({

site_title,

phone,

address

});

if(error)
throw error;

}

alert("Site ayarları kaydedildi.");

}
catch(err){

console.error(err);

alert("Site ayarları kaydedilemedi.");

}

}
/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   Bölüm 5-A
   Ana Site Entegrasyonu
========================================================== */

/* ==========================================================
   KATEGORİYE GÖRE ÜRÜNLERİ GETİR
========================================================== */

async function kategoriUrunleriGetir(kategori){

    try{

        const { data, error } =
            await supabase
                .from("products")
                .select("*")
                .eq("category", kategori)
                .eq("is_active", true)
                .order("created_at", {
                    ascending:false
                });

        if(error)
            throw error;

        return data || [];

    }

    catch(err){

        console.error(
            "Kategori ürünleri alınamadı:",
            err
        );

        return [];

    }

}

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script src="supabase.js"></script>

<script>

async function urunleriYukle(){

const galeri =
document.getElementById("gallery");

if(!galeri)
return;

galeri.innerHTML="";

const { data, error } =
await supabase
.from("products")
.select("*")
.eq("category","Halılar")
.eq("is_active",true)
.order("created_at",{ascending:false});

if(error){

console.error(error);

galeri.innerHTML=`
<p style="text-align:center">
Ürünler yüklenemedi.
</p>
`;

return;

}

if(data.length===0){

galeri.innerHTML=`
<p style="text-align:center">
Bu kategoride henüz ürün bulunmuyor.
</p>
`;

return;

}

data.forEach((urun) => {

    const kart = document.createElement("div");

    kart.className = "card";

    kart.innerHTML = `
        <img
            src="${urun.image_url || 'resimler/resim-yok.jpg'}"
            alt="${urun.name}"
            loading="lazy"
            onerror="this.src='resimler/resim-yok.jpg'"
        >

        <div class="card-content">

            <h3>${urun.name}</h3>

            <p>${urun.description || ""}</p>

        </div>
    `;

    galeri.appendChild(kart);

});

</script>

