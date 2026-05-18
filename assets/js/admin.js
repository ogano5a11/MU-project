$(document).ready(function() {
            
    // 1. Simulasi Login
    $("#btn-login").click(function() {
        $("#login-screen").fadeOut(500, function() {
            $("#dashboard-screen").fadeIn(500);
        });
    });

    // 2. Simulasi Logout
    $("#btn-logout").click(function() {
        $("#dashboard-screen").fadeOut(300, function() {
            $("#login-screen").fadeIn(300);
        });
    });

    // 3. Tab Navigation (Sidebar)
    $(".nav-link").click(function() {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        let targetPanel = $(this).data("target");

        $(".panel").hide();
        $(targetPanel).fadeIn(400);
    });

    // Dinamika Form: Tampilkan form skor hanya jika status selesai
    $("#input-status-laga").change(function() {
        if ($(this).val() === "Selesai") {
            $("#input-grup-skor").slideDown();
        } else {
            $("#input-grup-skor").slideUp();
            $("#input-skor-laga").val(""); // Kosongkan skor
        }
    });

    // A. Read (Tabel Jadwal)
    function muatTabelJadwal() {
        $.ajax({
            type: "GET",
            url: "api/get_jadwal.php",
            dataType: "json",
            success: function(data) {
                let tbody = $("#tabel-jadwal-body");
                tbody.empty();
                if (data.length === 0) {
                    tbody.append('<tr><td colspan="6" style="text-align:center; padding:15px;">Belum ada jadwal.</td></tr>');
                    return;
                }
                data.forEach(function(jadwal, index) {
                    let skorText = jadwal.status === "Selesai" ? jadwal.skor : "-";
                    let baris = `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${index + 1}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">${jadwal.lawan}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">${jadwal.tanggal}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">${jadwal.status}</td>
                            <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${skorText}</td>
                            <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">
                                <button class="btn-edit-jadwal" style="background: #D6A449; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; margin-right: 5px;" 
                                    data-id="${jadwal.id}" data-lawan="${jadwal.lawan}" data-tanggal="${jadwal.tanggal}" data-status="${jadwal.status}" data-skor="${jadwal.skor}">Edit</button>
                                <button class="btn-hapus-jadwal" style="background: #111; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;" 
                                    data-id="${jadwal.id}">Hapus</button>
                            </td>
                        </tr>`;
                    tbody.append(baris);
                });
            }
        });
    }
    muatTabelJadwal();

    // B. Create & Update
    $("#form-jadwal").submit(function(e) {
        e.preventDefault();
        let id = $("#input-id-jadwal").val();
        let lawan = $("#input-lawan").val();
        let tanggal = $("#input-tanggal").val();
        let status = $("#input-status-laga").val();
        let skor = $("#input-skor-laga").val();

        let apiUrl = id === "" ? "api/simpan_jadwal.php" : "api/update_jadwal.php";

        $.ajax({
            type: "POST", url: apiUrl, dataType: "json",
            data: { id: id, lawan: lawan, tanggal: tanggal, status: status, skor: skor },
            success: function(response) {
                if(response.status === "sukses") {
                    alert(response.pesan);
                    resetFormJadwal();
                    muatTabelJadwal();
                } else { alert("Gagal: " + response.pesan); }
            }
        });
    });

    // C. Persiapan Edit
    $(document).on("click", ".btn-edit-jadwal", function() {
        $("#input-id-jadwal").val($(this).data("id"));
        $("#input-lawan").val($(this).data("lawan"));
        $("#input-tanggal").val($(this).data("tanggal"));
        
        let status = $(this).data("status");
        $("#input-status-laga").val(status).trigger('change'); 
        $("#input-skor-laga").val($(this).data("skor"));

        $("#btn-simpan-jadwal").text("Update Jadwal");
        $("#btn-batal-edit-jadwal").show();
        $("html, body").animate({ scrollTop: $("#form-jadwal").offset().top - 20 }, "fast");
    });

    // D. Delete
    $(document).on("click", ".btn-hapus-jadwal", function() {
        if(confirm("Hapus jadwal ini?")) {
            $.ajax({
                type: "POST", url: "api/hapus_jadwal.php", dataType: "json",
                data: { id: $(this).data("id") },
                success: function(response) {
                    if(response.status === "sukses") {
                        alert(response.pesan); muatTabelJadwal();
                    } else { alert("Gagal: " + response.pesan); }
                }
            });
        }
    });

    // E. Reset Form
    $("#btn-batal-edit-jadwal").click(resetFormJadwal);
    function resetFormJadwal() {
        $("#form-jadwal").trigger("reset");
        $("#input-id-jadwal").val("");
        $("#input-status-laga").trigger('change');
        $("#btn-simpan-jadwal").text("Simpan Jadwal");
        $("#btn-batal-edit-jadwal").hide();
    }

    // 5. Simpan Data Pemain ke Database MySQL via AJAX
    function muatTabelPemain() {
        $.ajax({
            type: "GET",
            url: "api/get_pemain.php",
            dataType: "json",
            success: function(data) {
                let tbody = $("#tabel-pemain-body");
                tbody.empty(); // Bersihkan tabel
                
                if (data.length === 0) {
                    tbody.append('<tr><td colspan="5" style="text-align:center; padding:15px;">Belum ada data pemain.</td></tr>');
                    return;
                }

                // Masukkan data ke dalam baris tabel
                data.forEach(function(pemain, index) {
                    let baris = `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${index + 1}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">${pemain.nama}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">${pemain.posisi}</td>
                            <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${pemain.nomor}</td>
                            <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">
                                <button class="btn-edit" style="background: #D6A449; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; margin-right: 5px;" 
                                    data-id="${pemain.id}" data-nama="${pemain.nama}" data-posisi="${pemain.posisi}" data-nomor="${pemain.nomor}" data-foto="${pemain.foto}">Edit</button>
                                <button class="btn-hapus" style="background: #111; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;" 
                                    data-id="${pemain.id}">Hapus</button>
                            </td>
                        </tr>
                    `;
                    tbody.append(baris);
                });
            }
        });
    }

    // Panggil fungsi saat halaman dashboard dimuat
    muatTabelPemain();


    // B. Fungsi Create & Update (Submit Form)
    $("#form-pemain").submit(function(e) {
        e.preventDefault(); 
        
        let id = $("#input-id").val(); // Cek apakah ada ID
        let nama = $("#input-nama").val();
        let posisi = $("#input-posisi").val();
        let nomor = $("#input-nomor").val();
        let foto = $("#input-foto").val();

        // Tentukan URL API berdasarkan apakah ID kosong (Tambah Baru) atau ada isinya (Update)
        let apiUrl = id === "" ? "api/simpan_pemain.php" : "api/update_pemain.php";

        $.ajax({
            type: "POST",
            url: apiUrl,
            data: { id: id, nama: nama, posisi: posisi, nomor: nomor, foto: foto },
            dataType: "json",
            success: function(response) {
                if(response.status === "sukses") {
                    alert(response.pesan);
                    resetForm(); // Kosongkan form
                    muatTabelPemain(); // Refresh tabel otomatis
                } else {
                    alert("Gagal: " + response.pesan);
                }
            }
        });
    });


    // C. Fungsi Persiapan Edit (Saat tombol Edit di tabel diklik)
    $(document).on("click", ".btn-edit", function() {
        // Ambil data dari atribut tombol
        let id = $(this).data("id");
        let nama = $(this).data("nama");
        let posisi = $(this).data("posisi");
        let nomor = $(this).data("nomor");
        let foto = $(this).data("foto");

        // Masukkan data ke dalam form input
        $("#input-id").val(id);
        $("#input-nama").val(nama);
        $("#input-posisi").val(posisi);
        $("#input-nomor").val(nomor);
        $("#input-foto").val(foto);

        // Ubah teks tombol dan munculkan tombol batal
        $("#btn-simpan-form").text("Update Data Pemain");
        $("#btn-batal-edit").show();
        
        // Scroll ke atas (ke arah form)
        $("html, body").animate({ scrollTop: 0 }, "fast");
    });


    // D. Fungsi Delete (Saat tombol Hapus diklik)
    $(document).on("click", ".btn-hapus", function() {
        let id = $(this).data("id");
        
        // Konfirmasi sebelum menghapus
        if(confirm("Apakah Anda yakin ingin menghapus pemain ini?")) {
            $.ajax({
                type: "POST",
                url: "api/hapus_pemain.php",
                data: { id: id },
                dataType: "json",
                success: function(response) {
                    if(response.status === "sukses") {
                        alert(response.pesan);
                        muatTabelPemain(); // Refresh tabel
                    } else {
                        alert("Gagal menghapus: " + response.pesan);
                    }
                }
            });
        }
    });

    // E. Fungsi Batal Edit
    $("#btn-batal-edit").click(function() {
        resetForm();
    });

    function resetForm() {
        $("#form-pemain").trigger("reset");
        $("#input-id").val(""); // Kosongkan hidden ID
        $("#btn-simpan-form").text("Simpan Data Pemain");
        $("#btn-batal-edit").hide();
    }

});