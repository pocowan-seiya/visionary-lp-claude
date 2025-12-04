-- Create lp_projects table
-- LP全体の基本情報 + セクション（JSON）
create table lp_projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  slug          text unique not null,
  status        text not null default 'draft', -- draft / preview / published
  theme         jsonb default '{}'::jsonb,
  sections      jsonb default '[]'::jsonb,    -- Section[]
  meta          jsonb default '{}'::jsonb,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Create index on user_id for better query performance
create index lp_projects_user_id_idx on lp_projects(user_id);

-- Create index on slug for public access
create index lp_projects_slug_idx on lp_projects(slug);

-- Create index on status for filtering
create index lp_projects_status_idx on lp_projects(status);

-- Create lp_vision_product table
-- ユーザーが入力する「Vision + Product + Bridge」
create table lp_vision_product (
  lp_id      uuid primary key references lp_projects(id) on delete cascade,
  vision     jsonb not null,
  product    jsonb not null,
  bridge     jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create user_styles table (optional feature)
-- ユーザーの文章スタイル情報（将来的な拡張）
create table user_styles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  style      jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table lp_projects enable row level security;
alter table lp_vision_product enable row level security;
alter table user_styles enable row level security;

-- RLS Policies for lp_projects

-- Users can view their own LP projects
create policy "Users can view their own LP projects"
  on lp_projects for select
  using (auth.uid() = user_id);

-- Users can view published LP projects by slug (public access)
create policy "Anyone can view published LP projects"
  on lp_projects for select
  using (status = 'published');

-- Users can insert their own LP projects
create policy "Users can insert their own LP projects"
  on lp_projects for insert
  with check (auth.uid() = user_id);

-- Users can update their own LP projects
create policy "Users can update their own LP projects"
  on lp_projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own LP projects
create policy "Users can delete their own LP projects"
  on lp_projects for delete
  using (auth.uid() = user_id);

-- RLS Policies for lp_vision_product

-- Users can view vision/product data for their own LP projects
create policy "Users can view their own vision/product data"
  on lp_vision_product for select
  using (
    exists (
      select 1 from lp_projects
      where lp_projects.id = lp_vision_product.lp_id
      and lp_projects.user_id = auth.uid()
    )
  );

-- Users can insert vision/product data for their own LP projects
create policy "Users can insert their own vision/product data"
  on lp_vision_product for insert
  with check (
    exists (
      select 1 from lp_projects
      where lp_projects.id = lp_vision_product.lp_id
      and lp_projects.user_id = auth.uid()
    )
  );

-- Users can update vision/product data for their own LP projects
create policy "Users can update their own vision/product data"
  on lp_vision_product for update
  using (
    exists (
      select 1 from lp_projects
      where lp_projects.id = lp_vision_product.lp_id
      and lp_projects.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from lp_projects
      where lp_projects.id = lp_vision_product.lp_id
      and lp_projects.user_id = auth.uid()
    )
  );

-- Users can delete vision/product data for their own LP projects
create policy "Users can delete their own vision/product data"
  on lp_vision_product for delete
  using (
    exists (
      select 1 from lp_projects
      where lp_projects.id = lp_vision_product.lp_id
      and lp_projects.user_id = auth.uid()
    )
  );

-- RLS Policies for user_styles

-- Users can view their own style data
create policy "Users can view their own style data"
  on user_styles for select
  using (auth.uid() = user_id);

-- Users can insert their own style data
create policy "Users can insert their own style data"
  on user_styles for insert
  with check (auth.uid() = user_id);

-- Users can update their own style data
create policy "Users can update their own style data"
  on user_styles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own style data
create policy "Users can delete their own style data"
  on user_styles for delete
  using (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers to auto-update updated_at
create trigger update_lp_projects_updated_at
  before update on lp_projects
  for each row
  execute function update_updated_at_column();

create trigger update_lp_vision_product_updated_at
  before update on lp_vision_product
  for each row
  execute function update_updated_at_column();

create trigger update_user_styles_updated_at
  before update on user_styles
  for each row
  execute function update_updated_at_column();
