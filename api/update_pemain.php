<?php
include 'koneksi.php';

$id = $_POST['id'];
$nama = $_POST['nama'];
$posisi = $_POST['posisi'];
$nomor = $_POST['nomor'];
$foto = $_POST['foto'];

$sql = "UPDATE pemain SET nama='$nama', posisi='$posisi', nomor='$nomor', foto='$foto' WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "sukses", "pesan" => "Data pemain berhasil diperbarui!"]);
} else {
    echo json_encode(["status" => "error", "pesan" => "Error: " . $conn->error]);
}

$conn->close();
?>