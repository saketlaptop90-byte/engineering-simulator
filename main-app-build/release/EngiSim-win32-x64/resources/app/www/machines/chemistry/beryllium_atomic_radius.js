import * as THREE from 'three';

export function createBerylliumAtomicRadius(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes the atomic radius of Be (112 pm).
    // Shows the nucleus and a sphere defining the boundary of the electron cloud.
    // Also draws a 3D ruler from the center to the edge.

    // Electron cloud boundary (semi-transparent)
    const radius = 4; // visual scale for 112 pm
    const cloudGeo = new THREE.SphereGeometry(radius, 64, 64);
    const cloudMat = new THREE.MeshPhysicalMaterial({
        color: 0x00c8ff,
        transparent: true,
        opacity: 0.2,
        transmission: 0.9,
        roughness: 0.1,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    group.add(cloud);

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    // 3D Ruler
    const rulerGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(radius, 0, 0)
    ]);
    const rulerMat = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.2, gapSize: 0.1 });
    const ruler = new THREE.Line(rulerGeo, rulerMat);
    ruler.computeLineDistances();
    group.add(ruler);

    // Label for 112 pm
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('112 pm', 128, 64);
    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
    const label = new THREE.Sprite(spriteMat);
    label.scale.set(3, 1.5, 1);
    label.position.set(radius / 2, 0.5, 0);
    group.add(label);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Slowly rotate the ruler around to show the spherical nature
            ruler.rotation.y = time * 0.5;
            
            // Keep label above the ruler
            const labelPos = new THREE.Vector3(radius / 2, 0, 0);
            labelPos.applyAxisAngle(new THREE.Vector3(0,1,0), time * 0.5);
            labelPos.y += 0.5;
            label.position.copy(labelPos);
            
            // Pulse the cloud slightly
            cloud.scale.setScalar(1 + Math.sin(time*3)*0.02);
            cloudMat.opacity = 0.2 + Math.cos(time*2)*0.05;
        },
        cleanup: () => {
            cloudGeo.dispose(); cloudMat.dispose();
            nucleus.geometry.dispose(); nucleus.material.dispose();
            rulerGeo.dispose(); rulerMat.dispose();
            tex.dispose(); spriteMat.dispose();
        }
    };
}