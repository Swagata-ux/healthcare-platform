terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "healthcare-platform-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "healthcare-platform-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

module "vpc" {
  source = "../../modules/vpc"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr          = var.vpc_cidr
  availability_zones = slice(data.aws_availability_zones.available.names, 0, 3)
}

module "eks" {
  source = "../../modules/eks"

  project_name         = var.project_name
  environment          = var.environment
  subnet_ids           = concat(module.vpc.public_subnet_ids, module.vpc.private_subnet_ids)
  private_subnet_ids   = module.vpc.private_subnet_ids
  kubernetes_version   = var.kubernetes_version
  node_instance_types  = var.node_instance_types
  node_desired_size    = var.node_desired_size
  node_max_size        = var.node_max_size
  node_min_size        = var.node_min_size
  public_access_cidrs  = var.public_access_cidrs
}

module "rds" {
  source = "../../modules/rds"

  project_name       = var.project_name
  environment        = var.environment
  vpc_id            = module.vpc.vpc_id
  subnet_ids        = module.vpc.private_subnet_ids
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  database_name     = var.database_name
  master_username   = var.db_master_username
}

module "redis" {
  source = "../../modules/redis"

  project_name    = var.project_name
  environment     = var.environment
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
  node_type      = var.redis_node_type
  num_cache_nodes = var.redis_num_nodes
}

module "s3" {
  source = "../../modules/s3"

  project_name = var.project_name
  environment  = var.environment
}

module "secrets" {
  source = "../../modules/secrets"

  project_name    = var.project_name
  environment     = var.environment
  database_password = module.rds.database_password
}