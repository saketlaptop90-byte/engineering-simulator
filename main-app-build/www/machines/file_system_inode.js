export function createFileSystemInode(THREE) {
    const group = new THREE.Group();

    // Materials
    const materialVFS = new THREE.MeshPhongMaterial({ color: 0x1565c0, transparent: true, opacity: 0.4 });
    const materialCache = new THREE.MeshPhongMaterial({ color: 0x2e7d32, transparent: true, opacity: 0.4 });
    const materialDir = new THREE.MeshPhongMaterial({ color: 0xfbc02d });
    const materialInode = new THREE.MeshPhongMaterial({ color: 0xef6c00 });
    const materialSuper = new THREE.MeshPhongMaterial({ color: 0xc62828 });
    const materialBitmap = new THREE.MeshPhongMaterial({ color: 0x6a1b9a });
    
    const materialPtrDir = new THREE.MeshPhongMaterial({ color: 0x00bcd4, emissive: 0x00bcd4, emissiveIntensity: 0.3 });
    const materialPtrInd = new THREE.MeshPhongMaterial({ color: 0x283593, emissive: 0x283593, emissiveIntensity: 0.3 });
    const materialPtrDbl = new THREE.MeshPhongMaterial({ color: 0xad1457, emissive: 0xad1457, emissiveIntensity: 0.3 });
    const materialData = new THREE.MeshPhongMaterial({ color: 0x37474f });
    
    const tracerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Points
    const pVFS = new THREE.Vector3(0, 8, 0);
    const pCache = new THREE.Vector3(0, 6, 0);
    const pDir = new THREE.Vector3(-4, 4, 0);
    const pInode = new THREE.Vector3(0, 4, 0);
    const pSuper = new THREE.Vector3(4, 4, 0);
    const pBitmap = new THREE.Vector3(4, 2, 0);
    
    const pDirectData = new THREE.Vector3(-4.5, -2, 0);
    
    const pIndBlock = new THREE.Vector3(-1.5, 1, 0);
    const pIndData = new THREE.Vector3(-1.5, -2, 0);
    
    const pDblBlock = new THREE.Vector3(1.5, 1.5, 0);
    const pDblIndBlock = new THREE.Vector3(2.5, 0, 0);
    const pDblData = new THREE.Vector3(2.5, -2, 0);

    // 1. VFS Layer
    const vfsLayer = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 2), materialVFS);
    vfsLayer.position.copy(pVFS);
    vfsLayer.userData = { name: "VFS Layer" };
    group.add(vfsLayer);

    // 2. Buffer Cache
    const bufferCache = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 2), materialCache);
    bufferCache.position.copy(pCache);
    bufferCache.userData = { name: "Buffer Cache" };
    group.add(bufferCache);

    // 3. Directory Entry
    const directoryEntry = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), materialDir);
    directoryEntry.position.copy(pDir);
    directoryEntry.userData = { name: "Directory Entry" };
    group.add(directoryEntry);

    // 4. Inode Table
    const inodeTable = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 2), materialInode);
    inodeTable.position.copy(pInode);
    inodeTable.userData = { name: "Inode Table" };
    group.add(inodeTable);

    // 5. Superblock
    const superblock = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), materialSuper);
    superblock.position.copy(pSuper);
    superblock.userData = { name: "Superblock" };
    group.add(superblock);

    // 6. Free Block Bitmap
    const freeBlockBitmap = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 2), materialBitmap);
    freeBlockBitmap.position.copy(pBitmap);
    freeBlockBitmap.userData = { name: "Free Block Bitmap" };
    group.add(freeBlockBitmap);

    // Helper for pointers
    function createPointer(p1, p2, material) {
        const distance = p1.distanceTo(p2);
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, distance), material);
        const position = p1.clone().lerp(p2, 0.5);
        cylinder.position.copy(position);
        cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
        return cylinder;
    }

    // 7. Direct Pointers
    const directPointers = new THREE.Group();
    directPointers.userData = { name: "Direct Pointers" };
    directPointers.add(createPointer(pInode, pDirectData, materialPtrDir));
    group.add(directPointers);

    // 8. Indirect Pointers
    const indirectPointers = new THREE.Group();
    indirectPointers.userData = { name: "Indirect Pointers" };
    const indBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materialPtrInd);
    indBox.position.copy(pIndBlock);
    indirectPointers.add(indBox);
    indirectPointers.add(createPointer(pInode, pIndBlock, materialPtrInd));
    indirectPointers.add(createPointer(pIndBlock, pIndData, materialPtrInd));
    group.add(indirectPointers);

    // 9. Double Indirect Pointers
    const doubleIndirectPointers = new THREE.Group();
    doubleIndirectPointers.userData = { name: "Double Indirect Pointers" };
    const dblBox1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materialPtrDbl);
    dblBox1.position.copy(pDblBlock);
    doubleIndirectPointers.add(dblBox1);
    const dblBox2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materialPtrDbl);
    dblBox2.position.copy(pDblIndBlock);
    doubleIndirectPointers.add(dblBox2);
    doubleIndirectPointers.add(createPointer(pInode, pDblBlock, materialPtrDbl));
    doubleIndirectPointers.add(createPointer(pDblBlock, pDblIndBlock, materialPtrDbl));
    doubleIndirectPointers.add(createPointer(pDblIndBlock, pDblData, materialPtrDbl));
    group.add(doubleIndirectPointers);

    // 10. Data Blocks
    const dataBlocks = new THREE.Group();
    dataBlocks.userData = { name: "Data Blocks" };
    for(let i=0; i<3; i++) {
        for(let j=0; j<10; j++) {
            const db = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), materialData);
            db.position.set(-4.5 + j*1.0, -2 - i*1.0, 0);
            dataBlocks.add(db);
        }
    }
    group.add(dataBlocks);

    // Tracer for Animation
    const tracer = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), tracerMat);
    vfsLayer.add(tracer);

    // Path for Tracer
    const path = [
        pVFS, pCache, pDir, pInode,
        pDirectData, pCache, pInode,
        pIndBlock, pIndData, pCache, pInode,
        pDblBlock, pDblIndBlock, pDblData, pCache, pVFS
    ];

    let time = 0;
    const update = (delta) => {
        time += delta * 1.5;
        const t = time % path.length;
        const index = Math.floor(t);
        const nextIndex = (index + 1) % path.length;
        const lerpFactor = t - index;
        
        const currentPos = path[index];
        const nextPos = path[nextIndex];
        
        const worldPos = currentPos.clone().lerp(nextPos, lerpFactor);
        tracer.position.copy(worldPos).sub(vfsLayer.position);
    };

    const quizzes = [
        {
            question: "What is the primary role of a Superblock in a file system?",
            options: [
                "To store the contents of a file",
                "To hold metadata about the entire file system (e.g., size, block size)",
                "To map file names to inode numbers",
                "To act as an intermediate cache for file reads"
            ],
            answer: 1
        },
        {
            question: "What information does an Inode primarily contain?",
            options: [
                "Only the file name and creation date",
                "File metadata (permissions, size, ownership) and pointers to data blocks",
                "The complete data of a file",
                "The list of all open file descriptors in the OS"
            ],
            answer: 1
        },
        {
            question: "Which of the following describes a Double Indirect Pointer?",
            options: [
                "A pointer that directly points to a data block.",
                "A pointer to a block of direct pointers.",
                "A pointer to a block of pointers, which in turn point to blocks of direct pointers.",
                "A pointer linking two inodes together."
            ],
            answer: 2
        },
        {
            question: "What does a Directory Entry primarily map?",
            options: [
                "A user ID to an Inode number",
                "A file name to its actual data blocks",
                "A file name to its corresponding Inode number",
                "A Superblock to the Inode Table"
            ],
            answer: 2
        },
        {
            question: "What is the function of the Free Block Bitmap?",
            options: [
                "To keep track of which data blocks are available or currently in use.",
                "To store small thumbnail images for files.",
                "To track user permissions across the filesystem.",
                "To compress data blocks for efficient storage."
            ],
            answer: 0
        },
        {
            question: "Why are indirect pointers used in a file system?",
            options: [
                "To make file reading faster by skipping the buffer cache.",
                "To allow files to grow larger than what direct pointers can reference.",
                "To encrypt file data securely.",
                "To reduce the number of inodes required in the system."
            ],
            answer: 1
        }
    ];

    return { group, update, quizzes };
}
