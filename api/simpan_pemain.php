<?php
include 'koneksi.php';

$nama = $_POST['nama'];
$posisi = $_POST['posisi'];
$nomor = $_POST['nomor'];
$foto = $_POST['foto'];

$sql = "INSERT INTO pemain (nama, posisi, nomor, foto) VALUES ('$nama', '$posisi', '$nomor', '$foto')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "sukses", "pesan" => "Data pemain berhasil disimpan!"]);
} else {
    echo json_encode(["status" => "error", "pesan" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>