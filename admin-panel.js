/* ==========================================================
   SUR HALI İZNİK - ADMIN PANEL JAVASCRIPT (GÜNCEL)
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Admin Panel Başlatılıyor...");

    // 1. Sekme geçişlerini ve modal olaylarını HİÇBİR ŞEYİ BEKLEMEDEN bağla
    menuHazirla();
    modalHazirla();
    cikisHazirla();

    // 2. Veritabanı ve Oturum işlemlerini arka planda güvenle başlat
    verileriYukleArkaplan();
});

/* ==========================================================
   1. SEKMELER ARASI GEÇİŞ (Tıklama Mantığı)
========================================================== */
function menuHazirla() {
    const menuItems = document.querySelectorAll(".menu-item");
    const pages = document.querySelectorAll(".page");

    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            // Çıkış butonuna basıldıysa sekme değiştirme
            if (item.id === "logoutButton") return;
            
            e.preventDefault();
            const pageId = item.getAttribute("data-page");
            if (!pageId) return;

            // Tüm menü butonlarından active sınıfını kaldır
            menuItems.forEach(btn => btn.classList.remove("active"));
            
            // Tüm sayfaları gizle
            pages.forEach(p => {
                p.classList.remove("active-page");
                p.style.display = "none";
            });

            // Tıklanan menüyü aktif yap
            item.classList.add("active");

            // Target sayfayı bul ve görünür yap
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add("active-page");
                targetPage.style.display = "block";
            } else {
                console.warn("Hedef sayfa bulunamadı:", pageId);
            }
        });
    });
}

/* ==========================================================
   2. ARKA PLAN VERİ YÜKLEME
========================================================== */
async function verileriYukleArkaplan() {
    try {
        await oturumKontrol();
        await dashboardYukle();
        await urunleriGetir();
        await resimleriGetir();
        await ayarlariGetir();
    } catch (err) {
        console.warn("Veri yükleme hatası (Menü çalışmaya devam eder):", err);
    }
}

/* ==========================================================
   3. OTURUM KONTROLÜ
========================================================== */
async function oturumKontrol() {
    if (!window.supabase) return;
    try {
        const { data, error } = await window.supabase.auth.getSession();
        if (error || !data.session) {
            console.log("Oturum açık değil veya geliştirme modunda.");
        }
    } catch (e) {
        console.error("Oturum kontrol hatası:", e);
    }
}

/* ==========================================================
   4. DASHBOARD İSTATİSTİKLERİ
========================================================== */
async function dashboardYukle() {
    if (!window.supabase) return;
    await toplamUrunSayisi();
    await toplamResimSayisi();
    await storageBilgisi();
}

async function toplamUrunSayisi() {
    try {
        const { count, error } = await window.supabase
            .from("products")
            .select("*", { count: "exact", head: true });
            
        if (!error && document.getElementById("totalProducts")) {
            document.getElementById("totalProducts").textContent = count || 0;
        }
    } catch (e) { console.error("Ürün sayısı alınamadı:", e); }
}

async function toplamResimSayisi() {
    try {
        const { data, error } = await window.supabase.storage.from("halilar").list();
        if (!error && document.getElementById("totalImages")) {
            document.getElementById("totalImages").textContent = data ? data.length : 0;
        }
    } catch (e) { console.error("Resim sayısı alınamadı:", e); }
}

async function storageBilgisi() {
    try {
        const { data, error } = await window.supabase.storage.from("halilar").list();
        if (error || !data) return;

        let toplam = 0;
        data.forEach(file => { if (file.metadata?.size) toplam += Number(file.metadata.size); });

        let sonuc = "0 B";
        if (toplam >= 1024 && toplam < 1024 * 1024) sonuc = (toplam / 1024).toFixed(1) + " KB";
        else if (toplam >= 1024 * 1024) sonuc = (toplam / (1024 * 1024)).toFixed(2) + " MB";

        if (document.getElementById("storageUsage")) {
            document.getElementById("storageUsage").textContent = sonuc;
        }
    } catch (e) { console.error("Storage bilgisi alınamadı:", e); }
}

/* ==========================================================
   5. ÜRÜN İŞLEMLERİ (Listeleme, Ekleme, Silme)
========================================================== */
async function urunleriGetir() {
    const tbody = document.getElementById("productTableBody");
    if (!tbody || !window.supabase) return;

    try {
        const { data, error } = await window.supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;">Henüz eklenmiş ürün bulunmuyor.</td></tr>`;
            return;
        }

        tbody.innerHTML = "";
        data.forEach(urun => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${urun.name || 'İsimsiz'}</strong><br><small style="color:#666;">${urun.size || ""}</small></td>
                <td>${urun.category || '-'}</td>
                <td>${urun.is_active !== false ? "🟢 Aktif" : "🔴 Pasif"}</td>
                <td>
                    <button class="btn btn-secondary" onclick="urunSil('${urun.id}')">Sil</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error("Ürünler getirilemedi:", e); }
}

async function urunSil(id) {
    if (!window.supabase) return;
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
        const { error } = await window.supabase.from("products").delete().eq("id", id);
        if (!error) {
            await urunleriGetir();
            await toplamUrunSayisi();
        } else {
            alert("Silme hatası: " + error.message);
        }
    }
}

/* ==========================================================
   6. RESİM GALERİSİ VE YÜKLEME
========================================================== */
async function resimleriGetir() {
    const galeri = document.getElementById("imageGallery");
    if (!galeri || !window.supabase) return;

    try {
        const { data, error } = await window.supabase.storage.from("halilar").list();
        if (error || !data || data.length === 0) {
            galeri.innerHTML = `<p style="color:#666;">Henüz yüklenmiş resim bulunmuyor.</p>`;
            return;
        }

        galeri.innerHTML = "";
        data.forEach(resim => {
            const { data: urlData } = window.supabase.storage.from("halilar").getPublicUrl(resim.name);
            const div = document.createElement("div");
            div.style.cssText = "background:#fff; padding:10px; border-radius:8px; text-align:center; border:1px solid #e2e8f0; box-shadow:0 1px 3px rgba(0,0,0,0.05);";
            div.innerHTML = `
                <img src="${urlData.publicUrl}" style="width:100%; height:110px; object-fit:cover; border-radius:4px;">
                <p style="font-size:11px; margin-top:6px; color:#4a5568; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${resim.name}</p>
            `;
            galeri.appendChild(div);
        });
    } catch (e) { console.error("Resimler getirilemedi:", e); }
}

/* ==========================================================
   7. SİTE AYARLARI
========================================================== */
async function ayarlariGetir() {
    if (!window.supabase) return;
    try {
        const { data } = await window.supabase.from("settings").select("*").limit(1).maybeSingle();
        if (data) {
            if (document.getElementById("siteTitle")) document.getElementById("siteTitle").value = data.site_title || "";
            if (document.getElementById("sitePhone")) document.getElementById("sitePhone").value = data.phone || "";
            if (document.getElementById("siteAddress")) document.getElementById("siteAddress").value = data.address || "";
        }
    } catch (e) { console.error("Ayarlar çekilemedi:", e); }
}

/* ==========================================================
   8. MODAL VE ÇIKIŞ İŞLEMLERİ
========================================================== */
function modalHazirla() {
    const modal = document.getElementById("productModal");
    const openBtn = document.getElementById("newProductButton");
    const closeBtn = document.getElementById("closeModal");
    const saveBtn = document.getElementById("saveProductButton");

    if (!modal) return;

    openBtn?.addEventListener("click", () => { modal.style.display = "flex"; });
    closeBtn?.addEventListener("click", () => { modal.style.display = "none"; });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    saveBtn?.addEventListener("click", async () => {
        await urunKaydet();
    });
}

async function urunKaydet() {
    if (!window.supabase) return;

    const name = document.getElementById("productName")?.value;
    const category = document.getElementById("productCategory")?.value;
    const size = document.getElementById("productSize")?.value;
    const price = document.getElementById("productPrice")?.value;
    const description = document.getElementById("productDescription")?.value;
    const fileInput = document.getElementById("productImage");

    if (!name || !category) {
        alert("Lütfen Ürün Adı ve Kategori alanlarını doldurun.");
        return;
    }

    let imageUrl = "";

    // Resim Yükleme Mantığı
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = `${Date.now()}_${file.name}`;
        
        const { data: uploadData, error: uploadError } = await window.supabase.storage
            .from("halilar")
            .upload(fileName, file);

        if (uploadError) {
            alert("Resim yüklenirken hata oluştu: " + uploadError.message);
            return;
        }

        const { data: urlData } = window.supabase.storage.from("halilar").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
    }

    // Veritabanına Ürün Ekleme
    const { error } = await window.supabase.from("products").insert([
        {
            name: name,
            category: category,
            size: size,
            price: price ? parseFloat(price) : null,
            description: description,
            image_url: imageUrl,
            is_active: true
        }
    ]);

    if (!error) {
        alert("Ürün başarıyla eklendi!");
        document.getElementById("productModal").style.display = "none";
        document.getElementById("productForm").reset();
        await urunleriGetir();
        await dashboardYukle();
    } else {
        alert("Ürün kaydedilirken hata oluştu: " + error.message);
    }
}

function cikisHazirla() {
    const logoutButton = document.getElementById("logoutButton");
    logoutButton?.addEventListener("click", async () => {
        if (confirm("Çıkış yapmak istiyor musunuz?")) {
            if (window.supabase) await window.supabase.auth.signOut();
            window.location.href = "admin-giris.html";
        }
    });
}
