/* Playwright V14 · tests de experiencia Chrome real sobre copia local de la web.
   No se envían formularios a servicios externos ni se usan datos de clientes. */
import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
test('V13 pública integrada: portada, Studio y demos accesibles',async ({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.locator('a[href="estudio/studio-v13.html"]').first()).toBeVisible();
 await page.goto('/estudio/studio-v13.html');
 await expect(page.getByRole('heading',{name:/Construye tu próxima web/i})).toBeVisible();
 await expect(page.locator('#project-list')).toBeVisible();
 await expect(page.locator('#v14-search')).toBeVisible();
 await info.attach('studio-desktop',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
 await page.setViewportSize({width:390,height:844});
 await info.attach('studio-mobile',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
 expect(errors).toEqual([]);
});
test('Mis proyectos PRO: guardado, búsqueda, favorito y versiones',async ({page})=>{
 await page.goto('/estudio/studio-v13.html');
 await page.getByRole('button',{name:/Guardar plantilla de ejemplo/i}).click();
 await expect(page.locator('#project-list .project-card')).toHaveCount(1);
 await page.locator('#v14-search').fill('nada-que-ver');
 await expect(page.locator('#project-list .project-card')).toHaveCount(0);
 await page.locator('#v14-search').fill('');
 await page.getByRole('button',{name:/Favorito/i}).first().click();
 await page.locator('#v14-favorites').check();
 await expect(page.locator('#project-list .project-card')).toHaveCount(1);
 await page.getByRole('button',{name:/Guardar versión/i}).click();
 await expect(page.getByRole('button',{name:/Restaurar versión \(1\)/i})).toBeVisible();
});
test('V14: preset premium, edición contextual y exportación multipágina ZIP',async ({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/estudio/builder-v12.html?new=1');
 await expect(page.locator('#status')).toContainText('Listo:');
 await expect(page.locator('#v14-template option')).toHaveCount(22);
 await page.locator('#v14-template').selectOption('taller-impacto');
 await expect(page.locator('#sector')).toHaveValue('taller');
 await expect(page.locator('#layout')).toHaveValue('full');
 const frame=page.frameLocator('#live-preview');
 await frame.locator('[data-field="headline"]').click();
 await expect(page.locator('#v14-selected-label')).toContainText('headline');
 await page.locator('#v14-selected-input').fill('Un taller diferente');
 await page.locator('#v14-apply-selection').click();
 await expect(page.locator('#headline')).toHaveValue('Un taller diferente');
 await page.locator('#tab-sections').click();
 await page.locator('#v14-multipage').check();
 await expect(page.locator('#v14-pages-list input')).toHaveCount(5);
 await page.locator('#v14-page-preview').selectOption('services');
 await expect(frame.locator('#services')).toBeVisible();
 await info.attach('editor-desktop',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
 await page.setViewportSize({width:390,height:844});
 await info.attach('editor-mobile',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#export').click()]);
 const target=await download.path();
 expect(target).toBeTruthy();
 const entries=execFileSync('unzip',['-Z','-1',target],{encoding:'utf8'});
 for(const filename of ['index.html','nosotros.html','servicios.html','galeria.html','contacto.html','styles.css','app.js','estructura-v14.json'])expect(entries).toContain(filename);
 const services=execFileSync('unzip',['-p',target,'servicios.html'],{encoding:'utf8'});
 expect(services).toContain('id="services"');
 expect(services).toContain('href="contacto.html"');
 expect(errors).toEqual([]);
});
test('La guía de entrega comprueba JSON sin publicar nada',async ({page})=>{
 await page.goto('/estudio/publicar-v13.html');
 await expect(page.getByRole('heading',{name:/Una web preparada/i})).toBeVisible();
 await expect(page.locator('input[type=file]')).toHaveCount(1);
 await expect(page.getByText(/no transmite ni publica archivos/i)).toBeVisible();
});
