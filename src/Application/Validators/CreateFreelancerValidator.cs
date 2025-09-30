using CDN.FreelancerAPI.Application.DTOs;
using CDN.FreelancerAPI.Application.Interfaces;
using FluentValidation;

namespace CDN.FreelancerAPI.Application.Validators;

public class CreateFreelancerValidator : AbstractValidator<CreateFreelancerDto>
{
    private readonly IFreelancerRepository _repository;

    public CreateFreelancerValidator(IFreelancerRepository repository)
    {
        _repository = repository;

        RuleFor(x => x.Username)
            .NotEmpty().MaximumLength(50);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(100)
            .MustAsync(BeUniqueEmail).WithMessage("Email already exists.");

        RuleFor(x => x.Phone)
            .NotEmpty().MaximumLength(20);
    }

    
    private async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
    {
        
        return !await _repository.IsEmailExistAsync(email);
    }
}
