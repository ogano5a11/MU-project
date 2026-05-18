$(document).ready(function() {
    
    // 1. Muat Data Pemain (Baca dari LocalStorage yang diisi Admin)
    function muatDataPemain() {
        let dataPemain = JSON.parse(localStorage.getItem("dataSkuadMU")) || [];
        let container = $("#skuad-container");
        
        container.empty();

        if(dataPemain.length === 0) {
            container.append("<p>Belum ada data pemain. Silakan tambahkan melalui Admin Hub.</p>");
            return;
        }

        dataPemain.forEach(function(pemain) {
            let cardHTML = `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front" style="background-image: url('${pemain.foto}');">
                        <div class="card-overlay"></div>
                        <h2 class="player-number">${pemain.nomor}</h2>
                        <div class="player-info">
                            <h3>${pemain.nama}</h3>
                            <p>${pemain.posisi}</p>
                        </div>
                    </div>
                    <div class="flip-card-back">
                        <h3>Statistik</h3>
                        <p>Gol: 0</p>
                        <p>Assist: 0</p>
                    </div>
                </div>
            </div>
            `;
            container.append(cardHTML);
        });

        // Pasang event klik untuk efek flip pada kartu yang baru dibuat
        $(".flip-card").click(function() {
            $(this).toggleClass("is-flipped");
        });
    }

    muatDataPemain();

    // 2. Timeline Slide
    $("#btn-sejarah").click(function() {
        $("#timeline-sejarah").slideToggle("slow");
        $(this).text($(this).text() == 'Buka Timeline Sejarah' ? 'Tutup Timeline Sejarah' : 'Buka Timeline Sejarah');
    });

    // 3. Accordion
    $(".accordion-header").click(function() {
        $(".accordion-content").not($(this).next()).slideUp("fast");
        $(this).next(".accordion-content").slideToggle("fast");
    });

    // 4. Slider Berita Animasi
    let currentSlide = 0;
    const slideCount = $(".slide").length;
    
    $("#btn-next").click(function() {
        if(currentSlide < slideCount - 1) {
            currentSlide++;
            $("#berita-slider").css("margin-left", `-${currentSlide * 100}%`);
        }
    });
    $("#btn-prev").click(function() {
        if(currentSlide > 0) {
            currentSlide--;
            $("#berita-slider").css("margin-left", `-${currentSlide * 100}%`);
        }
    });

    // 5. Animasi Progress Bar untuk Voting
    $(".vote-btn").click(function() {
        let targetBar = $(this).data("target"); 
        let targetValue = $(this).data("val"); 
        
        $(targetBar).animate({ width: targetValue }, 1000); 
        $(this).prop("disabled", true).text("Voted").css("background", "#ccc");
    });

});