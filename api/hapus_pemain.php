<?php
include 'koneksi.php';

$id = $_POST['id'];

$sql = "DELETE FROM pemain WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "sukses", "pesan" => "Data pemain berhasil dihapus!"]);
} else {
    echo json_encode(["status" => "error", "pesan" => "Error: " . $conn->error]);
}

$conn->close();
?>