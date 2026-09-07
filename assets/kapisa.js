document.addEventListener('DOMContentLoaded',()=>{
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const swatchColors={
  'midnight-navy':'#162B40',
  'navy':'#162B40',
  'navy-blue':'#162B40',
  'midnight':'#162B40',
  'deep-wine':'#602D3D',
  'wine':'#602D3D',
  'desert-sand':'#CBB69B',
  'dessert-sand':'#CBB69B',
  'sand':'#CBB69B',
  'baby-pink':'#E5B6BC',
  'pink':'#E5B6BC',
  'rose':'#E5B6BC'
};
const normalizeSwatchName=value=>String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function applySwatchColors(){
  qa('.variant-value--color span').forEach(el=>{
    const colorValue=el.title || el.textContent || '';
    const normalized=normalizeSwatchName(colorValue);
    const swatch=swatchColors[normalized] || Object.entries(swatchColors).find(([key])=>normalized.includes(key))?.[1];
    if(swatch){el.style.setProperty('--swatch',swatch);}
  });
}
const menu=q('[data-menu-toggle]'),mobile=q('[data-mobile-menu]');
if(menu&&mobile){menu.addEventListener('click',()=>{const open=!mobile.hidden;mobile.hidden=open;menu.setAttribute('aria-expanded',String(!open));});}
const header=q('[data-header]');let last=window.scrollY;window.addEventListener('scroll',()=>{if(!header)return;const y=window.scrollY;header.classList.toggle('is-scrolled',y>8);header.classList.toggle('is-hidden',y>last&&y>120);last=y},{passive:true});
qa('[data-qty-plus]').forEach(b=>b.addEventListener('click',()=>{const i=b.parentElement.querySelector('input');i.value=Number(i.value||1)+1;}));
qa('[data-qty-minus]').forEach(b=>b.addEventListener('click',()=>{const i=b.parentElement.querySelector('input');i.value=Math.max(0,Number(i.value||1)-1);}));
async function updateCartCount(){try{const r=await fetch('/cart.js');const c=await r.json();qa('[data-cart-count]').forEach(el=>el.textContent=c.item_count);return c;}catch(e){return null}}
async function renderCartDrawer(){const d=q('[data-cart-drawer]'),body=q('[data-cart-drawer-body]'),total=q('[data-cart-total]');if(!d||!body)return;try{const r=await fetch('/cart.js');const c=await r.json();body.innerHTML=c.items.length?c.items.map(i=>`<div class="drawer-item"><a href="${i.url}"><img src="${i.image||''}" alt=""></a><div><a href="${i.url}">${i.product_title}</a><small>${i.variant_title||''}</small><div class="drawer-item-row"><span>${i.quantity} × ${i.final_price?Shopify.formatMoney(i.final_price):''}</span><button data-drawer-remove="${i.key}">Remove</button></div></div></div>`).join(''):'<div class="drawer-empty">Your bag is empty.</div>';if(total)total.textContent=Shopify.formatMoney(c.total_price);qa('[data-drawer-remove]').forEach(b=>b.addEventListener('click',async()=>{await fetch('/cart/change.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:b.dataset.drawerRemove,quantity:0})});await updateCartCount();renderCartDrawer();}));}catch(e){}}
function openDrawer(){const d=q('[data-cart-drawer]');if(!d)return;renderCartDrawer();d.setAttribute('aria-hidden','false');document.body.classList.add('cart-open');}
function closeDrawer(){const d=q('[data-cart-drawer]');if(!d)return;d.setAttribute('aria-hidden','true');document.body.classList.remove('cart-open');}
qa('[data-cart-close]').forEach(b=>b.addEventListener('click',closeDrawer));
const cartLinks=qa('.header-icon[href$="/cart"], .header-icon[href*="/cart?"]');cartLinks.forEach(a=>a.addEventListener('click',e=>{if(q('[data-cart-drawer]')){e.preventDefault();openDrawer();}}));
qa('[data-quick-add]').forEach(b=>b.addEventListener('click',async()=>{b.disabled=true;try{const r=await fetch(`/products/${b.dataset.productHandle}.js`),p=await r.json();const v=p.variants.find(x=>x.available)||p.variants[0];if(!v.available)throw new Error();await fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({items:[{id:v.id,quantity:1}]})});await updateCartCount();openDrawer();}catch(e){window.location.href=`/products/${b.dataset.productHandle}`;}finally{b.disabled=false;}}));
qa('.product-form').forEach(form=>{const dataEl=form.querySelector('[data-variant-json]');let variants=[];try{variants=JSON.parse(dataEl?.textContent||'[]')}catch(e){};const id=form.querySelector('input[name="id"]'),price=form.closest('.product-info')?.querySelector('.product-info-price'),submit=form.querySelector('.product-submit');const updateMedia=(variant,colorValue)=>{const media=qa('[data-gallery-media]'),thumbs=qa('[data-gallery-thumb]');const visibleForMedia=item=>{const ids=(item.dataset.mediaVariantIds||'').split(',').filter(Boolean);if(!ids.length)return true;if(ids.includes(String(variant.id)))return true;if(colorValue==='')return false;return ids.some(mediaVariantId=>{const linked=variants.find(candidate=>String(candidate.id)===mediaVariantId);if(!linked)return false;return linked.options.some(option=>option.toLowerCase()===colorValue.toLowerCase());});};media.forEach(item=>{item.hidden=!visibleForMedia(item);});thumbs.forEach(item=>{item.hidden=!visibleForMedia(item);});const firstVisible=media.find(item=>!item.hidden);media.forEach(item=>item.classList.toggle('is-active',item===firstVisible));thumbs.forEach(item=>item.classList.toggle('is-active',firstVisible&&item.dataset.galleryThumb===firstVisible.dataset.galleryMedia));};const selectVariant=()=>{if(!variants.length)return;const checked=[...form.querySelectorAll('input[name^="options["]:checked')],opts=[...checked].map(x=>x.value);const v=variants.find(x=>x.options.every((o,i)=>o===opts[i]))||variants[0];const colorInput=checked.find(input=>/options\\[(color|colour)\\]/i.test(input.name));const colorValue=colorInput?.value||'';if(id)id.value=v.id;if(submit){submit.disabled=!v.available;submit.textContent=v.available?'Add to bag':'Sold out';}if(price&&v.price)price.innerHTML=Shopify.formatMoney(v.price);checked.forEach(input=>{const name=input.name.replace(/^options\\[|\\]$/g,'');const target=form.querySelector(`[data-selected-option="${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}"]`);if(target)target.textContent=input.value;});updateMedia(v,colorValue);};form.querySelectorAll('input[name^="options["]').forEach(x=>x.addEventListener('change',selectVariant));
form.addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(form);try{const r=await fetch('/cart/add.js',{method:'POST',headers:{Accept:'application/json'},body:fd});if(!r.ok)throw new Error();await updateCartCount();openDrawer();}catch(err){const m=form.querySelector('[data-product-form-message]');if(m)m.textContent='Unable to add this item. Please try again.';}});selectVariant();});
qa('[data-gallery-thumb]').forEach(thumb=>thumb.addEventListener('click',()=>{qa('[data-gallery-thumb]').forEach(item=>item.classList.remove('is-active'));thumb.classList.add('is-active');const target=q(`[data-gallery-media="${thumb.dataset.galleryThumb}"]`);if(target)target.scrollIntoView({behavior:'smooth',block:'nearest'});}));
applySwatchColors();
const videoCards=qa('[data-video-card]'),videoModal=q('[data-video-modal]'),modalVideo=q('[data-modal-video]'),modalImage=q('[data-modal-image]'),modalTitle=q('[data-modal-title]'),modalPrice=q('[data-modal-price]'),modalLink=q('[data-modal-link]'),modalVariant=q('[data-modal-variant]'),videoMessage=q('[data-video-message]');let activeVideo=0;
function videoData(index){const card=videoCards[(index+videoCards.length)%videoCards.length];if(!card)return null;let variants=[];try{variants=JSON.parse(card.dataset.videoVariants||'[]')}catch(e){};return {card,variants};}
function showVideo(index){const data=videoData(index);if(!data)return;activeVideo=(index+videoCards.length)%videoCards.length;const card=data.card;const source=card.dataset.videoSrc||card.querySelector('video source')?.src||card.querySelector('video')?.currentSrc||card.querySelector('video')?.src;if(source){modalVideo.src=source;modalVideo.muted=false;modalVideo.play().catch(()=>{});}modalImage.src=card.dataset.videoImage||'';modalTitle.textContent=card.dataset.videoTitle||'';modalPrice.textContent=card.dataset.videoPrice||'';modalLink.href=card.dataset.videoUrl||'#';modalVariant.innerHTML='';data.variants.forEach(v=>{const option=document.createElement('option');option.value=v.id;option.textContent=v.title+(v.available?'':' - Sold out');option.disabled=!v.available;modalVariant.appendChild(option);});if(data.variants.length)modalVariant.value=card.dataset.videoVariant;videoMessage.textContent='';}
function openVideo(index){if(!videoModal)return;showVideo(index);videoModal.setAttribute('aria-hidden','false');document.body.classList.add('video-modal-open');}
function closeVideo(){if(!videoModal)return;videoModal.setAttribute('aria-hidden','true');document.body.classList.remove('video-modal-open');modalVideo.pause();}
videoCards.forEach((card,index)=>card.addEventListener('click',()=>openVideo(index)));
qa('[data-video-close]').forEach(button=>button.addEventListener('click',closeVideo));
const moveVideo=direction=>showVideo(activeVideo+direction);
qa('[data-video-modal-prev]').forEach(button=>button.addEventListener('click',()=>moveVideo(-1)));
qa('[data-video-modal-next]').forEach(button=>button.addEventListener('click',()=>moveVideo(1)));
qa('[data-video-prev]').forEach(button=>button.addEventListener('click',()=>q('[data-video-track]')?.scrollBy({left:-320,behavior:'smooth'})));
qa('[data-video-next]').forEach(button=>button.addEventListener('click',()=>q('[data-video-track]')?.scrollBy({left:320,behavior:'smooth'})));
qa('[data-video-sound]').forEach(button=>button.addEventListener('click',()=>{modalVideo.muted=!modalVideo.muted;button.textContent=modalVideo.muted?'Unmute':'Mute';}));
qa('[data-video-add]').forEach(button=>button.addEventListener('click',async()=>{const variantId=modalVariant.value||videoCards[activeVideo]?.dataset.videoVariant;if(!variantId)return;button.disabled=true;videoMessage.textContent='Adding...';try{const response=await fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({items:[{id:Number(variantId),quantity:1}]})});if(!response.ok)throw new Error('Unable to add item');await updateCartCount();videoMessage.textContent='Added to your bag';}catch(error){videoMessage.textContent='Unable to add this item. Please try again.';}finally{button.disabled=false;}}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeVideo();if(videoModal?.getAttribute('aria-hidden')==='false'&&event.key==='ArrowRight')moveVideo(1);if(videoModal?.getAttribute('aria-hidden')==='false'&&event.key==='ArrowLeft')moveVideo(-1);});
});
