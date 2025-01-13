# -*- mode: python ; coding: utf-8 -*-
import os
import sys
from PyInstaller.utils.hooks import collect_data_files
from PyInstaller.utils.hooks import copy_metadata

urlextract_datas = collect_data_files('urlextract')
tweetnlp_datas = collect_data_files('tweetnlp')

a = Analysis(
    ['routes.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('./static', 'static'),
        *urlextract_datas,
        *tweetnlp_datas,
        *copy_metadata('tweetnlp'),
        *copy_metadata('urlextract')
    ],
    # hiddenimports=['transformers', 'torch'],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='routes',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='routes',
)