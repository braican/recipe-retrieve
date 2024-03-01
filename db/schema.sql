--
-- Public profiles table
--
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  email text unique,
  full_name text,
  avatar_url text,
  constraint valid_email check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');


--
-- Recipes table.
--
create table recipes (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users,
  title text,
  source_url text,
  image_url text,
  ingredients text[],
  steps text[],
  featured_ingredients int[],
  tags int[],
  foreign key (featured_ingredients) references ingredients(id),
  foreign key (tags) references tags(id)
)

alter table recipes
  enable row level security;

create policy "Recipes are viewable by everyone." on recipes
  for select using (true);

create policy "Users can insert their own recipes." on recipes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own recipes." on recipes
  for update using (auth.uid() = user_id);

--
-- Ingredients table.
--
create table ingredients (
  id bigint generated by default as identity primary key,
  title text,
)

alter table ingredients
  enable row level security;

create policy "Ingredients are viewable by everyone." on ingredients
  for select using (true);

--
-- Tags table.
--
create table tags (
  id bigint generated by default as identity primary key,
  title text
)

alter table tags
  enable row level security;

create policy "Tags are viewable by everyone." on tags
  for select using (true);