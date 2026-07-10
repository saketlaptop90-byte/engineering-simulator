import * as THREE from 'three';

export function createBerylliumIonicBonding(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes Be forming an ionic bond (e.g., BeF2).
    // Be gives up its 2 valence electrons to two Fluorine atoms.
    // Be becomes Be2+ (shrinks immensely). F becomes F- (expands).

    // Centers
    const posBe = new THREE.Vector3(0, 0, 0);
    const posF1 = new THREE.Vector3(-5, 0, 0);
    const posF2 = new THREE.Vector3(5, 0, 0);

    // Geometries
    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    
    // Beryllium (Starts large, neutral)
    const beMat = new THREE.MeshPhysicalMaterial({ color: 0x00c8ff, transparent: true, opacity: 0.8, transmission: 0.5 });
    const be = new THREE.Mesh(sphereGeo, beMat);
    be.position.copy(posBe);
    be.scale.setScalar(3); // neutral size
    group.add(be);
    
    // Fluorine 1 & 2 (Start small, neutral)
    const fMat = new THREE.MeshPhysicalMaterial({ color: 0x00ff44, transparent: true, opacity: 0.8, transmission: 0.5 });
    const f1 = new THREE.Mesh(sphereGeo, fMat);
    f1.position.copy(posF1);
    f1.scale.setScalar(2.5); // F neutral is smaller than Be
    group.add(f1);
    
    const f2 = new THREE.Mesh(sphereGeo, fMat);
    f2.position.copy(posF2);
    f2.scale.setScalar(2.5);
    group.add(f2);

    // The transferring electrons
    const eGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const e1 = new THREE.Mesh(eGeo, eMat);
    const e2 = new THREE.Mesh(eGeo, eMat);
    group.add(e1);
    group.add(e2);

    // Nuclei
    const nucGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const beNuc = new THREE.Mesh(nucGeo, new THREE.MeshBasicMaterial({color:0xffffff}));
    const f1Nuc = new THREE.Mesh(nucGeo, new THREE.MeshBasicMaterial({color:0xffffff}));
    const f2Nuc = new THREE.Mesh(nucGeo, new THREE.MeshBasicMaterial({color:0xffffff}));
    beNuc.position.copy(posBe); f1Nuc.position.copy(posF1); f2Nuc.position.copy(posF2);
    group.add(beNuc); group.add(f1Nuc); group.add(f2Nuc);

    // Text Labels
    const createLabel = (text, pos) => {
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(text, 64, 32);
        const tex = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
        sprite.scale.set(3, 1.5, 1);
        sprite.position.copy(pos);
        sprite.position.y += 4;
        group.add(sprite);
        return { sprite, tex };
    };

    const lBe = createLabel('Be', posBe);
    const lF1 = createLabel('F', posF1);
    const lF2 = createLabel('F', posF2);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // 10 second animation cycle
            const cycle = (time % 10) / 10;
            
            if (cycle < 0.2) {
                // Neutral state. Electrons orbit Be.
                be.scale.setScalar(3);
                beMat.color.setHex(0x00c8ff);
                lBe.sprite.material.map.image.getContext('2d').clearRect(0,0,128,64);
                lBe.sprite.material.map.image.getContext('2d').fillText('Be', 64, 32);
                lBe.sprite.material.map.needsUpdate = true;
                
                f1.scale.setScalar(2.5);
                f2.scale.setScalar(2.5);
                
                e1.position.set(Math.cos(time*5)*3, Math.sin(time*5)*3, 0);
                e2.position.set(Math.cos(time*5+Math.PI)*3, Math.sin(time*5+Math.PI)*3, 0);
            } else if (cycle < 0.5) {
                // Transfer state. Electrons travel from Be to F atoms.
                const t = (cycle - 0.2) / 0.3; // 0 to 1
                
                // Be shrinks to Be2+
                be.scale.setScalar(3 - 2*t);
                beMat.color.setHex(0xff0044); // turns red (positive)
                
                // F expands to F-
                f1.scale.setScalar(2.5 + 1*t);
                f2.scale.setScalar(2.5 + 1*t);
                
                // Electrons fly across
                const start1 = new THREE.Vector3(Math.cos(time*5)*3, Math.sin(time*5)*3, 0);
                const start2 = new THREE.Vector3(Math.cos(time*5+Math.PI)*3, Math.sin(time*5+Math.PI)*3, 0);
                e1.position.lerpVectors(start1, posF1, t);
                e2.position.lerpVectors(start2, posF2, t);
            } else if (cycle < 0.9) {
                // Ionic State
                be.scale.setScalar(1);
                lBe.sprite.material.map.image.getContext('2d').clearRect(0,0,128,64);
                lBe.sprite.material.map.image.getContext('2d').fillText('Be2+', 64, 32);
                lBe.sprite.material.map.needsUpdate = true;
                
                f1.scale.setScalar(3.5);
                f2.scale.setScalar(3.5);
                
                // Electrons orbit F atoms now
                e1.position.copy(posF1).add(new THREE.Vector3(Math.cos(time*5)*3.5, Math.sin(time*5)*3.5, 0));
                e2.position.copy(posF2).add(new THREE.Vector3(Math.cos(time*5)*3.5, Math.sin(time*5)*3.5, 0));
                
                // Electrostatic attraction pulse
                const pulse = 1 + Math.sin(time*10)*0.05;
                f1.position.x = -5 * pulse;
                f2.position.x = 5 * pulse;
            } else {
                // Resetting
                const t = (cycle - 0.9) / 0.1;
                f1.position.x = -5;
                f2.position.x = 5;
                be.scale.setScalar(1 + 2*t);
                f1.scale.setScalar(3.5 - 1*t);
                f2.scale.setScalar(3.5 - 1*t);
                beMat.color.setHex(0x00c8ff);
                
                e1.position.lerpVectors(e1.position, posBe, t);
                e2.position.lerpVectors(e2.position, posBe, t);
            }

            group.rotation.x = Math.sin(time*0.5) * 0.1;
        },
        cleanup: () => {
            sphereGeo.dispose();
            beMat.dispose(); fMat.dispose();
            eGeo.dispose(); eMat.dispose();
            nucGeo.dispose(); beNuc.material.dispose();
            lBe.tex.dispose(); lBe.sprite.material.dispose();
            lF1.tex.dispose(); lF1.sprite.material.dispose();
            lF2.tex.dispose(); lF2.sprite.material.dispose();
        }
    };
}