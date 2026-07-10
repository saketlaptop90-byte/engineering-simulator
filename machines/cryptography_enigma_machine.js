export function createEnigmaMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeometry = new THREE.BoxGeometry(10, 2, 8);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x3b2f2f, roughness: 0.8 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    group.add(base);

    // Rotors
    const rotorGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const rotorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7 });
    
    const rotors = [];
    for (let i = 0; i < 3; i++) {
        const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
        rotor.rotation.z = Math.PI / 2;
        rotor.position.set(-1.5 + i * 1.5, 2.5, -2);
        group.add(rotor);
        rotors.push(rotor);
    }

    // Keyboard (mock)
    const keyMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    for(let i=0; i<10; i++) {
        for(let j=0; j<3; j++) {
            const keyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
            const key = new THREE.Mesh(keyGeometry, keyMaterial);
            key.position.set(-4 + i * 0.8, 1.1, 0 + j * 1);
            group.add(key);
        }
    }

    // Animation: Rotate rotors
    const times = [0, 2, 4];
    const values0 = [0, Math.PI, 2 * Math.PI];
    const track0 = new THREE.NumberKeyframeTrack('.rotation[x]', times, values0);
    const clip0 = new THREE.AnimationClip('Rotor1Spin', 4, [track0]);
    animationClips.push(clip0);

    return { group, animationClips };
}
