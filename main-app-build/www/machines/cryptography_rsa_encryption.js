export function createRSAEncryption(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Keys
    const keyMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.8, roughness: 0.2 });
    
    const pubKeyGeom = new THREE.TorusGeometry(1, 0.2, 16, 100);
    const pubKey = new THREE.Mesh(pubKeyGeom, keyMaterial);
    pubKey.position.set(-3, 2, 0);
    group.add(pubKey);

    const privKeyGeom = new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16);
    const privKey = new THREE.Mesh(privKeyGeom, keyMaterial);
    privKey.position.set(3, 2, 0);
    group.add(privKey);

    // Message block
    const msgGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const msgMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
    const message = new THREE.Mesh(msgGeom, msgMaterial);
    message.position.set(-6, 2, 0);
    message.name = "MessageBlock";
    group.add(message);

    // Animation: Move message through public key to private key
    const times = [0, 2, 4];
    const posValues = [-6, 2, 0, 0, 2, 0, 6, 2, 0];
    const colorTimes = [0, 2, 4];
    const colorValues = [0, 1, 0, 1, 0, 0, 0, 1, 0]; 

    const posTrack = new THREE.VectorKeyframeTrack('MessageBlock.position', times, posValues);
    const colorTrack = new THREE.ColorKeyframeTrack('MessageBlock.material.color', colorTimes, colorValues);
    
    const clip = new THREE.AnimationClip('EncryptDecrypt', 4, [posTrack, colorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
