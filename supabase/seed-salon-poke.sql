TRUNCATE TABLE public.services RESTART IDENTITY CASCADE;
INSERT INTO public.services(name,price,time,duration_minutes,category,description,enabled,published,sort_order) VALUES
('Men''s Haircut (Dry)',3500,45,45,'Haircut','',true,true,10),
('Men''s Haircut (Shampoo + Cut)',4000,60,60,'Haircut','',true,true,20),
('Ladies'' Haircut (Shampoo + Cut)',4000,60,60,'Haircut','',true,true,30),
('Men''s European Full Head Colour',10000,150,150,'Colour','Includes haircut.',true,true,40),
('Men''s Bleach & Colour',16000,210,210,'Colour','Includes haircut.',true,true,50),
('Ladies'' European Full Head Colour',10000,150,150,'Colour','Includes haircut.',true,true,60),
('Highlights & Colour',18000,240,240,'Colour','Includes haircut.',true,true,70),
('Balayage',24000,270,270,'Colour','Includes haircut.',true,true,80),
('Air Touch',30000,300,300,'Colour','Includes haircut.',true,true,90),
('Ladies'' Bleach & Colour',18000,240,240,'Colour','Includes haircut.',true,true,100),
('Men''s European Perm',10000,150,150,'Perm','Includes haircut.',true,true,110),
('Men''s Japanese Perm',12000,150,150,'Perm','Includes haircut.',true,true,120),
('Paimore Perm',16000,180,180,'Perm','Includes haircut.',true,true,130),
('Paimore Straight',20000,240,240,'Straightening','Includes haircut.',true,true,140),
('Paimore Straight & Perm',25000,300,300,'Straightening','Includes haircut.',true,true,150),
('Dr Jr Tokio Inkarami Treatment & Straight',32000,300,300,'Straightening','',true,true,160),
('Dr Jr Tokio Treatment, Straight & Curly',37000,360,360,'Straightening','',true,true,170),
('K18 Treatment',4000,45,45,'Treatment','',true,true,180),
('B5 Treatment',8000,60,60,'Treatment','',true,true,190),
('Dr Jr Tokio Inkarami Treatment',12000,90,90,'Treatment','',true,true,200),
('Scalp Treatment',8000,60,60,'Treatment','',true,true,210),
('Consultation Only',0,30,30,'Consultation','Recommended before major colour correction, perm or straightening.',true,true,220);

INSERT INTO public.site_content(id,data) VALUES (1, jsonb_build_object(
  'identity', jsonb_build_object('name','Salon Poke Bristol','shortName','Salon Poke','tagline','Asian hair salon','heroTitle','Hong Kong Hairstylist in Bristol'),
  'contact', jsonb_build_object('whatsapp','447724594963','email','hello@salonpokebristol.com','instagram','salonpokebristol','area','Bristol City Centre · Park Row Area','addressNote','The full address is shared once your appointment is confirmed.'),
  'bookingNotice','Choose your service, pick a time and we will confirm your appointment personally.'
)) ON CONFLICT (id) DO UPDATE SET data=EXCLUDED.data,updated_at=now();

INSERT INTO public.gallery_images(storage_path,alt_text,caption,sort_order,published) VALUES
('mens-textured-highlights.jpg','Textured men''s haircut with subtle highlights','Men''s Cut',10,true),
('c-curl-perm.jpg','Long layered cut with C-curl perm finish','Ladies Cut',20,true),
('studio-interior.jpg','Inside the Salon Poke Bristol studio','Our Studio',30,true),
('precision-cutting.jpg','Precision cutting in progress','Precision',40,true),
('in-the-studio.jpg','A client in the chair at the Bristol studio','In the chair',50,true),
('korean-cut-poster.jpg','Korean micro-differentiation haircut poster','Korean Cut',60,true)
ON CONFLICT (storage_path) DO UPDATE SET alt_text=EXCLUDED.alt_text,caption=EXCLUDED.caption,sort_order=EXCLUDED.sort_order,published=true;
