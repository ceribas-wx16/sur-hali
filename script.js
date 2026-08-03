document.addEventListener("DOMContentLoaded", async () => {

    await anaSayfaUrunleriniGetir();

});

async function anaSayfaUrunleriniGetir(){

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending:false });

    if(error){

        console.log(error);

        return;

    }

    console.log("Ürünler:", data);

}
