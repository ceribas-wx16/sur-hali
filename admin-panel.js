/* ==========================================================
   SUR HALI İZNİK - ADMIN PANEL (BİRLEŞTİRİLMİŞ & DÜZELTİLMİŞ)
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
        
        // Verileri Paralel / Sıralı Yükle
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
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        if (error) console.error(error);
        window.location.href = "admin-giris.html";
        return;
    }

    console.log("Giriş yapıldı:", data.session.user.email);
}

/* ==========================================================
   SOL MENÜ HAREKETLERİ
========================================================== */
function menuHazirla() {
    const menuItems = document.querySelectorAll(".menu-item");
    const pages = document.querySelectorAll(".page");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            if (item.id === "logoutButton") return;

            menuItems.forEach(button => button.classList.remove("active"));
            pages.forEach(page => page.classList.remove("active-page"));

            item.classList.add("active");

            const target = document.getElementById(item.dataset.page);
            if (target) {
                target.classList.add("active-page");
            }
        });
    });
}

/* ==========================================================
   MODAL (ÜRÜN EKLE/DÜZENLE PENCERESİ)
========================================================== */
function modalHazirla() {
    const modal = document.getElementById("productModal");
    const openButton = document.getElementById("newProductButton");
    const closeButton = document.getElementById("closeModal");

    if (!modal) return;

    openButton?.addEventListener("click", () => {
        // Yeni ürün eklerken formu sıfırla
        formuTemizle();
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
   ÇIKIŞ YAP
========================================================== */
function cikisHazirla() {
    const logoutButton = document.getElementById("logoutButton");
    if (!logoutButton) return;

    logoutButton.addEventListener("click", async () => {
        const cevap = confirm("Çıkış yapmak istiyor musunuz?");
        if (!cevap) return;

        try {
            await supabase.auth.signOut();
            window.location.href = "admin-giris.html";
        } catch (err) {
            console.error(err);
            alert("Çıkış yapılamadı.");
        }
    });
}

/* ==========================================================
   DASHBOARD İSTATİSTİKLERİ
========================================================== */
async function dashboardYukle() {
    console.log("Dashboard yükleniyor...");
    await toplamUrunSayisi();
    await toplamResimSayisi();
    await storageBilgisi();
}

async function toplamUrunSayisi() {
    try {
        const { count, error } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true });

        if (error) throw error;

        const alan = document.getElementById("totalProducts");
        if (alan) alan.textContent = count || 0;
    } catch (err) {
        console.error("Ürün sayısı alınamadı:", err);
    }
}

async function toplamResimSayisi() {
    try {
        const { data, error } = await supabase.storage.from("halilar").list();
        if (error) throw error;

        const alan = document.getElementById("totalImages");
        if (alan) alan.textContent = data ? data.length : 0;
    } catch (err) {
        console.error("Resim sayısı alınamadı:", err);
    }
}

async function storageBilgisi() {
    try {
        const { data, error } = await supabase.storage.from("halilar").list();
        if (error) throw error;

        let toplam = 0;
        data?.forEach(file => {
            if (file.metadata?.size) {
                toplam += Number(file.metadata.size);
            }
        });

        let sonuc = "0 B";
        if (toplam >= 1024 && toplam < 1024 * 1024) {
            sonuc = (toplam / 1024).toFixed(1) + " KB";
        } else if (toplam >= 1024 * 1024) {
            sonuc = (toplam / (1024 * 1024)).toFixed(2) + " MB";
        }

        const alan = document.getElementById("storageUsage");
        if (alan) alan.textContent = sonuc;
    } catch (err) {
        console.error("Storage bilgisi alınamadı:", err);
    }
}

/* ==========================================================
   ÜRÜNLERİ LİSTELE
========================================================== */
async function urunleriGetir() {
    console.log("Ürünler yükleniyor...");
    const tbody = document.getElementById("productTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;padding:35px;">
                        Henüz ürün bulunmuyor.
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach(urun => urunSatiriOlustur(urun));
        console.log(data.length + " ürün listelendi.");
    } catch (err) {
        console.error("Ürünler getirilemedi:", err);
    }
}

function urunSatiriOlustur(urun) {
    const tbody = document.getElementById("productTableBody");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>
            <strong>${urun.name}</strong><br>
            <small>${urun.size || ""}</small>
        </td>
        <td>${urun.category}</td>
        <td>${urun.is_active ? "🟢 Aktif" : "🔴 Pasif"}</td>
        <td>
            <button class="editButton" data-id="${urun.id}">Düzenle</button>
            <button class="deleteButton" data-id="${urun.id}">Sil</button>
        </td>
    `;
    tbody.appendChild(tr);
}

/* ==========================================================
   ÜRÜN DÜZENLE / SİL BUTON DİNLEYİCİSİ
========================================================== */
document.addEventListener("click", async (e) => {
    // SİLME İŞLEMİ
    if (e.target.classList.contains("deleteButton")) {
        const id = e.target.dataset.id;
        if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

        try {
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) throw error;

            alert("Ürün silindi.");
            await urunleriGetir();
            await toplamUrunSayisi();
        } catch (err) {
            console.error(err);
            alert("Ürün silinemedi.");
        }
    }

    // DÜZENLEME İŞLEMİ
    if (e.target.classList.contains("editButton")) {
        const id = e.target.dataset.id;
        await urunBilgileriniYukle(id);
    }
});

async function urunBilgileriniYukle(id) {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        document.getElementById("productName").value = data.name || "";
        document.getElementById("productCategory").value = data.category || "";
        document.getElementById("productSize").value = data.size || "";
        document.getElementById("productPrice").value = data.price || "";
        document.getElementById("productDescription").value = data.description || "";

        const saveBtn = document.getElementById("saveProductButton");
        if (saveBtn) saveBtn.dataset.editId = id;

        const modal = document.getElementById("productModal");
        if (modal) modal.style.display = "flex";
    } catch (err) {
        console.error(err);
        alert("Ürün bilgileri alınamadı.");
    }
}

/* ==========================================================
   ÜRÜN KAYDET (EKLE & GÜNCELLE)
========================================================== */
const saveProductButton = document.getElementById("saveProductButton");
if (saveProductButton) {
    saveProductButton.addEventListener("click", urunKaydet);
}

async function urunKaydet() {
    try {
        const id = saveProductButton.dataset.editId || null;
        const name = document.getElementById("productName").value.trim();
        const category = document.getElementById("productCategory").value.trim();
        const size = document.getElementById("productSize").value.trim();
        const price = Number(document.getElementById("productPrice").value);
        const description = document.getElementById("productDescription").value.trim();
        const file = document.getElementById("productImage").files[0];

        if (!name) return alert("Ürün adı zorunludur.");
        if (!category) return alert("Kategori seçiniz.");

        let imageUrl = "";

        // Resim Yükleme Mantığı
        if (file) {
            // Türkçe karakter ve boşluk temizleme
            const temizDosyaAd = file.name
                .replace(/ğ/g, "g").replace(/Ğ/g, "G")
                .replace(/ü/g, "u").replace(/Ü/g, "U")
                .replace(/ş/g, "s").replace(/Ş/g, "S")
                .replace(/ı/g, "i").replace(/İ/g, "I")
                .replace(/ö/g, "o").replace(/Ö/g, "O")
                .replace(/ç/g, "c").replace(/Ç/g, "C")
                .replace(/\s+/g, "_")
                .replace(/[^a-zA-Z0-9._-]/g, "");

            const dosyaAdi = Date.now() + "-" + temizDosyaAd;

            const { error: uploadError } = await supabase.storage
                .from("halilar")
                .upload(dosyaAdi, file);

            if (uploadError) {
                console.error(uploadError);
                alert("Resim yüklenemedi.");
                return;
            }

            const { data: publicData } = supabase.storage
                .from("halilar")
                .getPublicUrl(dosyaAdi);

            imageUrl = publicData.publicUrl;
        }

        const urun = {
            name,
            category,
            size,
            price,
            description,
            is_active: true
        };

        if (imageUrl !== "") {
            urun.image_url = imageUrl;
        }

        if (id) {
            const { error } = await supabase.from("products").update(urun).eq("id", id);
            if (error) throw error;
            alert("Ürün başarıyla güncellendi.");
        } else {
            const { error } = await supabase.from("products").insert([urun]);
            if (error) throw error;
            alert("Ürün başarıyla eklendi.");
        }

        formuTemizle();

        const modal = document.getElementById("productModal");
        if (modal) modal.style.display = "none";

        await dashboardYukle();
        await urunleriGetir();
        await resimleriGetir();
    } catch (err) {
        console.error(err);
        alert("Ürün kaydedilirken hata oluştu.");
    }
}

function formuTemizle() {
    const fields = ["productName", "productCategory", "productSize", "productPrice", "productDescription", "productImage"];
    fields.forEach(f => {
        const el = document.getElementById(f);
        if (el) el.value = "";
    });
    if (saveProductButton) delete saveProductButton.dataset.editId;
}

/* ==========================================================
   RESİM GALERİSİ & SİLME
========================================================== */
async function resimleriGetir() {
    try {
        const galeri = document.getElementById("imageGallery");
        if (!galeri) return;

        galeri.innerHTML = "";

        const { data, error } = await supabase.storage.from("halilar").list("", {
            limit: 100,
            sortBy: { column: "created_at", order: "desc" }
        });

        if (error) throw error;

        if (!data || data.length === 0) {
            galeri.innerHTML = `<div style="padding:40px;text-align:center;color:#666;">Henüz resim bulunmuyor.</div>`;
            return;
        }

        data.forEach(resim => {
            const url = supabase.storage.from("halilar").getPublicUrl(resim.name).data.publicUrl;
            const kart = document.createElement("div");
            kart.className = "image-card";
            kart.innerHTML = `
                <img src="${url}" alt="">
                <div class="image-name">${resim.name}</div>
                <button class="deleteImageButton" data-name="${resim.name}">Resmi Sil</button>
            `;
            galeri.appendChild(kart);
        });
    } catch (err) {
        console.error("Resimler getirilemedi:", err);
    }
}

document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("deleteImageButton")) return;

    const dosyaAdi = e.target.dataset.name;
    if (!confirm("Bu resmi silmek istiyor musunuz?")) return;

    try {
        const { error } = await supabase.storage.from("halilar").remove([dosyaAdi]);
        if (error) throw error;

        alert("Resim silindi.");
        await resimleriGetir();
        await toplamResimSayisi();
        await storageBilgisi();
    } catch (err) {
        console.error(err);
        alert("Resim silinemedi.");
    }
});

/* ==========================================================
   SİTE AYARLARI
========================================================== */
async function ayarlariGetir() {
    try {
        const { data, error } = await supabase
            .from("settings")
            .select("*")
            .limit(1)
            .maybeSingle();

        if (error) {
            console.log("Settings tablosu kullanılmıyor veya erişilemedi.");
            return;
        }

        if (!data) return;

        const title = document.getElementById("siteTitle");
        const phone = document.getElementById("sitePhone");
        const address = document.getElementById("siteAddress");

        if (title) title.value = data.site_title || "";
        if (phone) phone.value = data.phone || "";
        if (address) address.value = data.address || "";
    } catch (err) {
        console.error(err);
    }
}

const settingsForm = document.getElementById("settingsForm");
if (settingsForm) {
    settingsForm.addEventListener("submit", ayarlariKaydet);
}

async function ayarlariKaydet(e) {
    e.preventDefault();
    try {
        const site_title = document.getElementById("siteTitle").value.trim();
        const phone = document.getElementById("sitePhone").value.trim();
        const address = document.getElementById("siteAddress").value.trim();

        const { data } = await supabase.from("settings").select("id").limit(1).maybeSingle();

        if (data) {
            const { error } = await supabase.from("settings").update({ site_title, phone, address }).eq("id", data.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from("settings").insert({ site_title, phone, address });
            if (error) throw error;
        }

        alert("Site ayarları kaydedildi.");
    } catch (err) {
        console.error(err);
        alert("Site ayarları kaydedilemedi.");
    }
}
