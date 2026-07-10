export function createAnimalCell(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Cell Membrane (cutaway)
    const membraneGeometry = new THREE.SphereGeometry(5, 32, 32, 0, Math.PI * 1.5);
    const membraneMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffaaad, 
        transparent: true, 
        opacity: 0.4,
        side: THREE.DoubleSide
    });
    const membrane = new THREE.Mesh(membraneGeometry, membraneMaterial);
    group.add(membrane);

    // Nucleus
    const nucleusGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const nucleusMaterial = new THREE.MeshStandardMaterial({ color: 0x8a2be2 });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    nucleus.position.set(-1, 0, -1);
    group.add(nucleus);

    // Nucleolus
    const nucleolusGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const nucleolusMaterial = new THREE.MeshStandardMaterial({ color: 0xff69b4 });
    const nucleolus = new THREE.Mesh(nucleolusGeometry, nucleolusMaterial);
    nucleus.add(nucleolus);
    nucleolus.position.set(0.4, 0.4, 0.4);

    // Mitochondria
    const mitoMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });
    for (let i = 0; i < 4; i++) {
        const mitoGeometry = new THREE.CapsuleGeometry(0.4, 1, 8, 16);
        const mito = new THREE.Mesh(mitoGeometry, mitoMaterial);
        mito.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6
        );
        mito.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        
        // Ensure it's roughly inside the cell and not inside the nucleus
        if (mito.position.length() < 4 && mito.position.distanceTo(nucleus.position) > 2) {
            group.add(mito);
        }
    }

    return { group, animationClips };
}
