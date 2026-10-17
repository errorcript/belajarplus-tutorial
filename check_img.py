import os, sys

print("Python version:", sys.version)
try:
    from PIL import Image
    print("PIL is available")
    im1 = Image.open("bukti_terbaru_dashboard_wonosobo.png")
    print("Dashboard size:", im1.size)
    im2 = Image.open("bukti_terbaru_siswa_wonosobo.png")
    print("Siswa size:", im2.size)
    im3 = Image.open("bukti_terbaru_rombel_wonosobo.png")
    print("Rombel size:", im3.size)
except Exception as e:
    print("Error:", e)
